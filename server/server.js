const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Resort = require('./models/Resort');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional log for database name
    console.log(`Using database: ${mongoose.connection.name}`);
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Auth Routes
app.post('/auth/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({ username, password: hashedPassword, role });
  await user.save();

  res.status(201).json(user);
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Create JWT
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware to protect routes
const authMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;

      if (role && role !== decoded.role) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    });
  };
};

// Public routes
app.get('/resorts', async (req, res) => {
  try {
    const resorts = await Resort.find();
    console.log('Fetched resorts:', resorts);  // Add debugging statement
    res.json(resorts);
  } catch (error) {
    console.error('Error fetching resorts:', error);  // Add debugging statement
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
app.post('/resorts', authMiddleware('owner'), async (req, res) => {
  try {
    const resort = new Resort(req.body);
    await resort.save();
    res.json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/resorts/:id/rating', authMiddleware('admin'), async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const resort = await Resort.findByIdAndUpdate(id, { rating }, { new: true });
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Temporary route to insert sample data
app.get('/insertSampleData', async (req, res) => {
  try {
    const sampleData = new Resort({
      name: "Sample Resort",
      location: "https://maps.google.com",
      description: "A beautiful resort.",
      images: ["https://example.com/image1.jpg"],
      owner: "owner_id",
      price: 100,
      rating: 4.5
    });
    await sampleData.save();
    res.status(201).json(sampleData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

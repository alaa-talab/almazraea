const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Resort Schema
const resortSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  images: [String],
  owner: String,
  price: Number,
  rating: { type: Number, default: 0 }
});

const Resort = mongoose.model('Resort', resortSchema);

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
  const resorts = await Resort.find();
  res.json(resorts);
});

// Protected routes
app.post('/resorts', authMiddleware('owner'), async (req, res) => {
  const resort = new Resort(req.body);
  await resort.save();
  res.json(resort);
});

app.put('/resorts/:id/rating', authMiddleware('admin'), async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  
  const resort = await Resort.findByIdAndUpdate(id, { rating }, { new: true });

  if (!resort) {
    return res.status(404).json({ message: 'Resort not found' });
  }

  res.json(resort);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const validator = require('validator');
const emailValidator = require('email-validator');
const multer = require('multer');
const http = require('http');
const cloudinary = require('./cloudinaryConfig');
const Resort = require('./models/Resort');
const User = require('./models/User');
const Comment = require('./models/Comment');
require('./passportConfig');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFileToCloudinary = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'resorts' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const authMiddleware = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Failed to authenticate token:', err);
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
      req.userId = decoded.id;
      req.userRole = decoded.role;
      console.log('Authenticated user:', decoded);
      if (role && role !== decoded.role) {
        console.log('Access denied for role:', decoded.role);
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    });
  };
};

// Fetch user profile
app.get('/user/:id', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Update user profile
app.put('/user/:id', authMiddleware(), upload.single('profilePicture'), async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this profile.' });
    }

    const updates = req.body;

    if (req.file) {
      const profilePictureUrl = await uploadFileToCloudinary(req.file.buffer, 'image');
      updates.profilePicture = profilePictureUrl;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const urls = await Promise.all(
      req.files.map(file => uploadFileToCloudinary(file.buffer, file.mimetype.startsWith('image/') ? 'image' : 'video'))
    );
    res.status(200).json({ urls });
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Almazraea API');
});

app.post('/auth/register', async (req, res) => {
  const { email, username, password, phone, role } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with the provided email, username, or phone' });
    }
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Weak password' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword, phone, role });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, role: newUser.role, userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, userId: user._id });
});

// Google OAuth routes
app.get('/auth/google', (req, res, next) => {
  req.session.role = req.query.role;
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    if (!req.user.role) {
      req.user.role = req.session.role;
      await req.user.save();
    }
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000?token=${token}&role=${req.user.role}&userId=${req.user._id}`);
  }
);

// Facebook OAuth routes
app.get('/auth/facebook', (req, res, next) => {
  req.session.role = req.query.role;
  next();
}, passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    if (!req.user.role) {
      req.user.role = req.session.role;
      await req.user.save();
    }
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000?token=${token}&role=${req.user.role}&userId=${req.user._id}`);
  }
);

// Backend route for fetching resorts with owner information populated
app.get('/resorts', async (req, res) => {
  try {
    const { name, location, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case insensitive search
    }
    if (location) {
      query.location = location;
    }
    if (minPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    const resorts = await Resort.find(query)
      .populate('owner', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(resorts);
  } catch (error) {
    console.error('Error fetching resorts:', error);
    res.status(500).json({ message: error.message });
  }
});


app.get('/resorts/:id', async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id)
      .populate('owner', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.json(resort);
  } catch (error) {
    console.error('Error fetching resort:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add resort endpoint
app.post('/resorts', authMiddleware('owner'), async (req, res) => {
  try {
    const { name, phone, location, locationLink, description, images, videos, photoBanner, minPrice, maxPrice, rating } = req.body;
    const newResort = new Resort({
      name,
      phone,
      location,
      locationLink,
      description,
      images,
      videos,
      photoBanner,
      minPrice,
      maxPrice,
      rating,
      owner: req.userId
    });
    await newResort.save();
    res.status(201).json(newResort);
  } catch (error) {
    console.error('Error creating resort:', error);
    res.status(500).json({ message: 'Failed to create resort.' });
  }
});

// Add a comment to a resort
app.post('/resorts/:id/comments', authMiddleware(), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received user ID from auth middleware:', req.userId);

    const { text, user } = req.body;
    const resortId = req.params.id;

    if (!text) {
      console.error('Comment text is required');
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (!user) {
      console.error('User ID is required');
      return res.status(400).json({ message: 'User ID is required' });
    }

    const foundUser = await User.findById(user);
    if (!foundUser) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const resort = await Resort.findById(resortId);
    if (!resort) {
      console.error('Resort not found');
      return res.status(404).json({ message: 'Resort not found' });
    }

    // Validate and clean existing comments
    resort.comments = resort.comments.filter(comment => comment.text && comment.user);
    
    const newComment = {
      text,
      user
    };

    resort.comments.push(newComment);
    await resort.save();

    const populatedResort = await Resort.findById(resortId).populate('comments.user', 'username profilePicture');
    res.status(201).json({ comments: populatedResort.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Fetch comments for a resort
app.get('/resorts/:id/comments', async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id).populate('comments.user', 'username profilePicture');
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.json(resort.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
});

// Fetch resorts for the logged-in owner
app.get('/myresorts', authMiddleware('owner'), async (req, res) => {
  try {
    const resorts = await Resort.find({ owner: req.userId }).populate('owner', 'username profilePicture');
    res.json(resorts);
  } catch (error) {
    console.error('Error fetching owner resorts:', error);
    res.status(500).json({ message: 'Failed to fetch resorts.' });
  }
});

// Update a resort
app.put('/resorts/:id', authMiddleware('owner'), async (req, res) => {
  try {
    const resort = await Resort.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found or not owned by the user.' });
    }
    res.json(resort);
  } catch (error) {
    console.error('Error updating resort:', error);
    res.status(500).json({ message: 'Failed to update resort.' });
  }
});

// Delete a resort
app.delete('/resorts/:id', authMiddleware('owner'), async (req, res) => {
  try {
    const resort = await Resort.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found or not owned by the user.' });
    }
    res.json({ message: 'Resort deleted successfully.' });
  } catch (error) {
    console.error('Error deleting resort:', error);
    res.status(500).json({ message: 'Failed to delete resort.' });
  }
});

server.listen(5000, () => console.log('Server is running on port 5000'));

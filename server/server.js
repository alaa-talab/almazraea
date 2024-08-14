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
const Counter = require('./models/Counter');
const nodemailer = require('nodemailer');
require('./passportConfig');


dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { secure: false } }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define a valid ObjectId for the admin user
const ADMIN_ID = new mongoose.Types.ObjectId(); // Use a valid ObjectId

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERBANE,
  password: process.env.ADMIN_PASSWORD,
};

const getNextSequence = async (name) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

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

// Define the middleware to accept both 'admin' and 'owner'
const authMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'لم يتم توفير الرمز' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, decoded) => {
      if (err) {
        const message = err.name === 'TokenExpiredError' ? 'انتهت صلاحية الجلسة' : 'فشل في المصادقة على الرمز';
        return res.status(401).json({ message });
      }
      req.userId = decoded.id; // This should be the user's ID from the token
      req.userRole = decoded.role;
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'الدخول محظور' });
      }
      next();
    });
  };
};

module.exports = authMiddleware;



// Define the admin user in your database (if not already present)
const ensureAdminUserExists = async () => {
  try {
    const adminUser = await User.findOne({ username: ADMIN_CREDENTIALS.username });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
      const newAdmin = new User({
        _id: ADMIN_ID,
        username: ADMIN_CREDENTIALS.username,
        email: 'admin@example.com', // Ensure to provide a valid email
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error ensuring admin user exists:', error);
  }
};
ensureAdminUserExists();

// Fetch all users
app.get('/users', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Update user information
app.put('/users/:id', authMiddleware('admin'), upload.single('profilePicture'), async (req, res) => {
  try {
    const { password, role, username, email, phone } = req.body;
    const updates = { username, email, role, phone };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
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
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

// Add a new user
app.post('/users', authMiddleware('admin'), async (req, res) => {
  const { email, username, password, phone, role } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with the provided email or username' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword, phone, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user.' });
  }
});

// Fetch homepage resorts
app.get('/homepage-resorts', async (req, res) => {
  try {
    const homepageResorts = await Resort.find({ homepage: true }).populate('owner', 'username profilePicture');
    res.json(homepageResorts);
  } catch (error) {
    console.error('Error fetching homepage resorts:', error);
    res.status(500).json({ message: 'Failed to fetch homepage resorts.' });
  }
});


// Update homepage resorts
app.post('/homepage-resorts', authMiddleware('admin'), async (req, res) => {
  try {
    const { resorts } = req.body; // Expecting an array of resort IDs

    // Reset the homepage status for all resorts
    await Resort.updateMany({}, { $set: { homepage: false } });

    // Set the homepage status for selected resorts
    await Resort.updateMany({ _id: { $in: resorts } }, { $set: { homepage: true } });

    res.json({ message: 'Homepage resorts updated successfully.' });
  } catch (error) {
    console.error('Error updating homepage resorts:', error);
    res.status(500).json({ message: 'Failed to update homepage resorts.' });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Set up email data
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: 'alaatalab99@gmail.com',  // list of receivers
      subject: 'New Contact Form almazraea  ', // Subject line
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // plain text body
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});


// Add resort endpoint for admin
app.post('/admin/add-resort', authMiddleware('admin'), async (req, res) => {
  try {
    const { name, phone, location, locationLink, description, images, videos, photoBanner, minPrice, maxPrice, rating, available, homepage } = req.body;
    const newResort = new Resort({
      name,
      phone,
      location,
      locationLink,
      description,
      images,
      videos,
      available,
      photoBanner,
      minPrice,
      maxPrice,
      rating,
      owner: req.userId,
      homepage // Include homepage field
    });
    await newResort.save();
    res.status(201).json(newResort);
  } catch (error) {
    console.error('Error creating resort:', error);
    res.status(500).json({ message: 'Failed to create resort.' });
  }
});


// Update resort rating
app.put('/resorts/:id/rate', authMiddleware('admin'), async (req, res) => {
  try {
    const { rating } = req.body;
    const resort = await Resort.findByIdAndUpdate(req.params.id, { rating }, { new: true });
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found.' });
    }
    res.json(resort);
  } catch (error) {
    console.error('Error updating resort rating:', error);
    res.status(500).json({ message: 'Failed to update resort rating.' });
  }
});

// Update a resort
app.put('/resorts/:id', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
      available,
      rating,
      homepage // Include homepage field
    } = req.body;

    const updatedResort = {
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
      available
    };

    // Ensure rating is updated only by admin
    if (req.userRole === 'admin') {
      updatedResort.rating = rating;
    }
     // Ensure rating is updated only by admin
     if (req.userRole === 'admin') {
      updatedResort.homepage = homepage;
    }

    const resort = await Resort.findByIdAndUpdate(id, updatedResort, { new: true });

    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.json(resort);
  } catch (error) {
    console.error('Error updating resort:', error);
    res.status(500).json({ message: 'Failed to update resort.' });
  }
});



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

// Fetch a single user
app.get('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

// Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminCredentials = {
    username: 'admin',
    password: 'Admin123$'
  };

  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ id: ADMIN_ID, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'admin' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
};

// Example admin-only route
app.get('/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Fetch total number of users
    const totalUsers = await User.countDocuments();

    // Fetch total number of resorts
    const totalResorts = await Resort.countDocuments();

    // Fetch total number of active resorts
    const activeResorts = await Resort.countDocuments({ available: true });

    // Fetch recent resorts (e.g., last 10 resorts added)
    const recentResorts = await Resort.find().sort({ createdAt: -1 }).limit(10);

    // Fetch recent users (e.g., last 10 users registered)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password');

    // Send the dashboard data as response
    res.json({
      totalUsers,
      totalResorts,
      activeResorts,
      recentResorts,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
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
    // const emailToken = jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, { expiresIn: '1h' });
    // const phoneToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit token
    const newUser = new User({ email, username, password: hashedPassword, phone, role /* , emailToken, phoneToken */ });
    await newUser.save();

    // sendVerificationEmail(email, emailToken);
    // if (phone) sendVerificationSMS(phone, phoneToken);

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, role: newUser.role, userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!password || !user.password) {
      console.error('Missing password:', { password, userPassword: user.password });
      return res.status(400).json({ message: 'Password is required' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'بيانات الدخول غبر صحيحة يرجى المحاولة مرة اخرى' });
    }

    if (user.googleId) {  // Assuming you have a `googleId` field in your user schema
      return res.status(400).json({ message: 'هذه البريد الكتروني مستخدم في جوجل يرجى الدخول عن طريق جوجل' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});


// Google OAuth routes
app.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Handle Google OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
  if (!req.user) {
    // Store profile data in session
    req.session.newUser = req.authInfo.profile;
    res.redirect('/select-role');
  } else {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000?token=${token}&role=${req.user.role}&userId=${req.user._id}`);
  }
});

// Facebook OAuth routes
app.get('/auth/facebook', (req, res, next) => {
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

// Handle Facebook OAuth callback
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), async (req, res) => {
  if (!req.user) {
    // Store profile data in session
    req.session.newUser = req.authInfo.profile;
    res.redirect('/select-role');
  } else {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000?token=${token}&role=${req.user.role}&userId=${req.user._id}`);
  }
});







// Backend route for fetching resorts with owner information populated
app.get('/resorts', async (req, res) => {
  try {
    const { name, location, sequence, minPrice, maxPrice, available } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case insensitive search
    }
    if (location) {
      query.location = location;
    }
    if (sequence) {
      query.sequence =  sequence;
    }

    // Adjust the query to handle price ranges
    if (minPrice || maxPrice) {
      query.$or = [];
      if (minPrice) {
        query.$or.push({ minPrice: { $lte: parseInt(minPrice) } });
      }
      if (maxPrice) {
        query.$or.push({ maxPrice: { $lte: parseInt(maxPrice) } });
      }
    }

    if (available !== undefined) {
      query.available = available === 'true';
    }

    const resorts = await Resort.find(query)
      .populate('owner', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(resorts);
  } catch (error) {
    console.error('Error fetching resorts:', error);
    res.status(500).json({ message: 'Failed to fetch resorts.' });
  }
});


app.get('/resorts/:id', async (req, res) => {
  try {
    console.log(`Fetching resort with ID: ${req.params.id}`);
    const resort = await Resort.findById(req.params.id)
      .populate('owner', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!resort) {
      console.log(`Resort with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Resort not found' });
    }

    console.log('Resort fetched successfully:', resort);
    res.json(resort);
  } catch (error) {
    console.error('Error fetching resort:', error);
    res.status(500).json({ message: error.message });
  }
});


// Backend endpoint to fetch resorts
app.get('/resorts', async (req, res) => {
  try {
    // Fetch resorts data from your database
    const resorts = await Resort.find();
    res.status(200).json(resorts);
  } catch (error) {
    console.error('Error fetching resorts:', error);
    res.status(500).json({ message: 'Failed to fetch resorts.' });
  }
});


// Add resort endpoint for both admin and user
app.post('/resorts', authMiddleware(['admin', 'user']), async (req, res) => {
  try {
    const { name, phone, location, locationLink, description, images, videos, photoBanner, minPrice, maxPrice, rating, available } = req.body;
    const sequence = await getNextSequence('resortId');
    const newResort = new Resort({
      name,
      phone,
      location,
      locationLink,
      description,
      images,
      videos,
      available,
      photoBanner,
      minPrice,
      maxPrice,
      rating,
      owner: req.userId,
      sequence
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
app.get('/myresorts', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const resorts = await Resort.find({ owner: req.userId }).populate('owner', 'username profilePicture');
    res.json(resorts);
  } catch (error) {
    console.error('Error fetching owner resorts:', error);
    res.status(500).json({ message: 'Failed to fetch resorts.' });
  }
});


// Update routes accordingly
app.post('/resorts', authMiddleware(['admin , user']), async (req, res) => {
  try {
    const { name, phone, location, locationLink, description, images, videos, photoBanner, minPrice, maxPrice, rating, available } = req.body;
    const sequence = await getNextSequence('resortId');
    const newResort = new Resort({
      name,
      phone,
      location,
      locationLink,
      description,
      images,
      videos, 
      available,
      photoBanner,
      minPrice,
      maxPrice,
      rating,
      owner: req.userId,
      sequence
    });
    await newResort.save();
    res.status(201).json(newResort);
  } catch (error) {
    console.error('Error creating resort:', error);
    res.status(500).json({ message: 'Failed to create resort.' });
  }
});

// Remove user profile picture
app.delete('/users/:id/profile-picture', authMiddleware(['admin', 'user']), async (req, res) => {
  try {
    if (req.params.id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the profile picture URL
    user.profilePicture = null;
    await user.save();

    res.json({ message: 'Profile picture removed successfully.' });
  } catch (error) {
    console.error('Error removing profile picture:', error);
    res.status(500).json({ message: 'Failed to remove profile picture.' });
  }
});

app.delete('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete all resorts owned by the user
    await Resort.deleteMany({ owner: userId });

    // Optionally, you can also delete comments made by the user
    await Comment.deleteMany({ user: userId });

    // Finally, delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User and related data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});




// Delete a resort
app.delete('/resorts/:id', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const resort = req.userRole === 'admin'
      ? await Resort.findByIdAndDelete(req.params.id)
      : await Resort.findOneAndDelete({ _id: req.params.id, owner: req.userId });

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

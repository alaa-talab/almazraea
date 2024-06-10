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
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const cloudinary = require('./cloudinaryConfig');
const Resort = require('./models/Resort');
const User = require('./models/User');
const Chat = require('./models/Chat');
require('./passportConfig');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

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

const createChatRoom = async (req, res) => {
  const { recipientId } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, recipientId] }
    }).populate('participants', 'username profilePicture');

    if (!chat) {
      chat = new Chat({ participants: [req.userId, recipientId] });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.error('Error fetching or creating chat:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error('Invalid chat room ID:', req.params.id); // Add logging
    return res.status(400).json({ message: 'Invalid chat room ID' });
  }
  next();
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
    res.status(201).json({ token, role: newUser.role, userId: newUser._id }); // Include userId
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
  res.json({ token, role: user.role, userId: user._id }); // Include userId
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
    const resort = await Resort.findById(req.params.id).populate('owner', 'username profilePicture');
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.json(resort);
  } catch (error) {
    console.error('Error fetching resort:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create or get chat
app.post('/chat', authMiddleware(), createChatRoom);


// Get all chats for a user
app.get('/user/:id/chats', authMiddleware(), async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.params.id
    }).populate('participants', 'username profilePicture');
    res.json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Get chat history
app.get('/chat/:id', authMiddleware(), validateObjectId, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages.sender', 'username profilePicture');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Send message
app.post('/chat/:id/message', authMiddleware(), validateObjectId, async (req, res) => {
  const { text } = req.body;
  try {
    const chatRoomId = new mongoose.Types.ObjectId(req.params.id);
    const chat = await Chat.findById(chatRoomId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    chat.messages.push({ sender: req.userId, text });
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.message === 'Invalid chat room ID: roomId') {
      return res.status(400).json({ message: 'Invalid chat room ID' });
    } else {
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }
});



// Chat functionality for real-time messages
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('joinRoom', ({ userId, room }) => {
    socket.join(room);
    console.log(`${userId} joined room: ${room}`);
  });

  socket.on('sendMessage', async ({ userId, room, message }) => {
    const newMessage = { sender: userId, room, message };
    const chat = await Chat.findById(room);
    if (chat) {
      chat.messages.push(newMessage);
      await chat.save();
      io.to(room).emit('receiveMessage', newMessage);
    }
  });
});

// Protected routes
app.post('/resorts', authMiddleware('owner'), async (req, res) => {
  try {
    const resort = new Resort({ ...req.body, owner: req.userId });
    await resort.save();
    res.json(resort);
  } catch (error) {
    console.error('Error creating resort:', error);
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
    console.error('Error updating rating:', error);
    res.status(500).json({ message: error.message });
  }
});

server.listen(5000, () => console.log('Server is running on port 5000'));

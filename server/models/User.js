// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  profilePicture: { type: String, default: 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png' },
  googleId: { type: String, unique: true },  // Add this field
  emailToken: { type: String },
  phoneToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String }, // Make password optional
  phone: { type: String },
  role: { type: String, enum: ['user', 'owner'], default: 'user' },
  profilePicture: { type: String } // Add profile picture field
});

const User = mongoose.model('User', userSchema);

module.exports = User;

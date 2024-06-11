const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String }, // Make password optional
  phone: { type: String },
  role: { type: String, enum: ['user', 'owner'], default: 'user' },
  profilePicture: { type: String, default: 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

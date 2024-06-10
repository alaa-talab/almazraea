const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  videos: [String],
  phone: { type: String, required: true },
  locationLink: { type: String, required: true },
  photoBanner: { type: String, required: true }, // Add this field
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  rating: { type: Number, default: 4 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;

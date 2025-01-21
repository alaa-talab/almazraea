const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const resortSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  locationLink: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  videos: [String],
  photoBanner: String,
  minPrice: { type: Number },
  maxPrice: { type: Number },
  rating: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  available: { type: Boolean }, // New property
  comments: [commentSchema],
  sequence: { type: Number, unique: true },
  homepage: { type: Boolean, default: false } // New property for homepage
}, { timestamps: true });

const Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;

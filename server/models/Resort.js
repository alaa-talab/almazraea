const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  owner: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 }
});

const Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;

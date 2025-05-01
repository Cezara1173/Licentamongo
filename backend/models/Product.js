const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  images: [String],
  attributes: {
    color: String,
    size: String,
    weight: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

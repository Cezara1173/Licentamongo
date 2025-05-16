const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: {
    type: Number,
    required: true,
    default: 0,        
  },
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

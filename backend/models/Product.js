const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: String,
    stock: Number,
    images: [String],
    attributes: {
      color: String,
      size: String,
      weight: String,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Product', productSchema);
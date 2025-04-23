const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    products: [
      {
        productId: mongoose.ObjectId,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
    orderStatus: String,
    createdAt: Date,
    updatedAt: Date,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    paymentMethod: String,
    paymentStatus: String,
  });
  module.exports = mongoose.model('Order', orderSchema);  
const mongoose = require('mongoose');

const expositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exposition', expositionSchema);

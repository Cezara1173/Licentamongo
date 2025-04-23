const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    nationality: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    artworkIds: [{ type: String, required: true }]
  });
  
  module.exports = mongoose.model('Artist', artistSchema);
  
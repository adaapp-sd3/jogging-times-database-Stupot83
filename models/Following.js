const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  
  followingId: {
    type: String,
    trim: true
  },
  followerId: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Following', followingSchema);
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

followingSchema.index({followingId: 1, followerId:1}, {unique: true});

module.exports = mongoose.model('Following', followingSchema);
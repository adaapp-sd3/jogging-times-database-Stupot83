const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  
  followersId: {
    type: String,
    trim: true
  },
  followedId: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Follower', followerSchema);
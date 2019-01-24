const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  
  startTime: {
    type: Date,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  distance: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Time', timeSchema);
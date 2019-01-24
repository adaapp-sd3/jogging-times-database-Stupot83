const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  
  startTime: {
    type: String,
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  distance: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Time', timeSchema);
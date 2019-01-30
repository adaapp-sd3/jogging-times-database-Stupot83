const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  
  startTime: {
    type: Date,
    trim: true
  },
  duration: {
    type: Number,
    trim: true
  },
  distance: {
    type: Number,
    trim: true
  },
  userId: {
    type: String,
    trim: true
  }
});

timeSchema.index({startTime: 1}, {unique: true});

timeSchema.virtual('averageSpeed').get(function() {  
  return (this.distance / this.duration).toFixed(2);
});

timeSchema.virtual('date').get(function() {
  return this.startTime.toUTCString().slice(0, -7);
});

module.exports = mongoose.model('Time', timeSchema);
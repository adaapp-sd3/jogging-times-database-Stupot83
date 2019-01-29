const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password_hash: {
    type: String,
    trim: true,
  },
});

function followMember() {
  console.log("poop");
}

module.exports = mongoose.model('User', userSchema);
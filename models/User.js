const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'citizen',
  },
  location: {
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'active',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

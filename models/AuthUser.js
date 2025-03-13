const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rewardPoints: { 
    type: Number, 
    default: 0  // ✅ New field to store total reward points
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

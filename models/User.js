const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

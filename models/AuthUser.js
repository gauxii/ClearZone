const mongoose = require('mongoose');

const AuthUserSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('AuthUser', AuthUserSchema);

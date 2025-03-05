const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Add bcryptjs for hashing

const authUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving
authUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to match passwords
authUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AuthUser = mongoose.model('AuthUser', authUserSchema);
module.exports = AuthUser;

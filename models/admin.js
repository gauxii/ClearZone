const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^ADMIN\d+$/.test(v); // Must start with "ADMIN" followed by digits
      },
      message: props => `${props.value} is not a valid Admin ID. It should start with 'ADMIN' followed by numbers.`
    }
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);

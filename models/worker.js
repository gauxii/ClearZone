const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^EMP\d+$/.test(v); // Must start with "EMP" followed by digits
      },
      message: props => `${props.value} is not a valid Employee ID. It should start with 'EMP' followed by numbers.`
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

module.exports = mongoose.model('Worker', WorkerSchema);

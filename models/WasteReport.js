const mongoose = require("mongoose");

const wasteReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Refers to the User model
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  imageUrl: {
    type: String, // URL of the uploaded waste image
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "completed"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WasteReport", wasteReportSchema);

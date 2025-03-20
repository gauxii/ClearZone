const mongoose = require("mongoose");

const WasteReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthUser", required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    address: { type: String,default: "Unknown Address"},
    assigned: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },
    status: { type: String, enum: ["waiting to assign", "assigned", "completed"], default: "waiting to assign" },
    pointsEarned: { type: Number, default: 10 },
    completedImage: { type: String, default: null }, // ✅ New field to store completed image URL
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
}, { timestamps: true });

module.exports = mongoose.model("WasteReport", WasteReportSchema);
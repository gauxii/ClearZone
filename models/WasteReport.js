const mongoose = require('mongoose');

const WasteReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { type: String, enum: ['pending', 'in progress', 'resolved', 'waiting to assign', 'assigned'], default: 'pending' },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null }, // ✅ Corrected field to ObjectId
  pointsEarned: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('WasteReport', WasteReportSchema);

const express = require('express');
const multer = require('multer'); // For handling file uploads
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const WasteReport = require('../models/WasteReport');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
require('dotenv').config();

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'waste_reports', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });

// ✅ Report Waste Endpoint
router.post('/report', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image upload is required' });
    }

    const wasteReport = new WasteReport({
      userId: req.user.id,
      description,
      imageUrl: req.file.path, // Cloudinary URL
      location: { latitude, longitude }
    });

    await wasteReport.save();
    res.status(201).json({ message: '✅ Waste reported successfully', wasteReport });
  } catch (err) {
    console.error('❌ Waste Report Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});
// ✅ Get All Waste Reports (For Workers)
router.get('/all-reports', authMiddleware, async (req, res) => {
  try {
    // Check if the user is a worker
    if (!req.user.id.startsWith('EMP')) {
      return res.status(403).json({ error: 'Access denied. Only workers can view reports.' });
    }

    const reports = await WasteReport.find().populate('userId', 'email');
    res.status(200).json(reports);
  } catch (err) {
    console.error('❌ Fetch Reports Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});


module.exports = router;

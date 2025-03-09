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
    console.log("🔹 User ID from authMiddleware:", req.user);
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 Uploaded File:", req.file);

    const { description, latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image upload is required' });
    }

    // ✅ Create and save the waste report
    const wasteReport = new WasteReport({
      userId: req.user.id,
      description,
      imageUrl: req.file.path,
      location: { latitude, longitude },
      assigned: 'none' // Default assigned field set to 'none'
    });

    await wasteReport.save();
    res.status(201).json({ message: '✅ Waste reported successfully', wasteReport });
  } catch (err) {
    console.error('❌ Waste Report Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Get All Waste Reports
router.get('/all-reports', authMiddleware, async (req, res) => {
  try {
    const reports = await WasteReport.find().populate('userId', 'email');
    res.status(200).json(reports);
  } catch (err) {
    console.error('❌ Fetch Reports Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Get All Reports Submitted by Logged-in User
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const userReports = await WasteReport.find({ userId: req.user.id })
      .select('description imageUrl location status assigned createdAt')
      .sort({ createdAt: -1 }); // Sort by most recent reports first

    res.status(200).json(userReports);
  } catch (err) {
    console.error('❌ Fetch User Reports Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;

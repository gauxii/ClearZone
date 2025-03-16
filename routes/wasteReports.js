const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const wasteReportController = require('../controllers/wasteReportController'); // ✅ Import controller functions

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
    folder: 'waste_reports',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });

// ✅ Routes
router.post('/report', authMiddleware, upload.single('image'), wasteReportController.reportWaste);
router.get('/my-reward-points', authMiddleware, wasteReportController.getRewardPoints);
router.get('/all-reports', authMiddleware, wasteReportController.getAllReports);
router.get('/my-reports', authMiddleware, wasteReportController.getMyReports);
router.post('/complete-task', authMiddleware, wasteReportController.completeTask);
router.get('/worker', authMiddleware, wasteReportController.getWorkerReports); // ✅ Fix ReferenceError

module.exports = router;
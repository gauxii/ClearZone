const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const wasteReportController = require('../controllers/wasteReportController');

require('dotenv').config();

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Multer Storage for Waste Report Images
const reportStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'waste_reports', // 🔹 Keep original waste report images here
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

// ✅ Multer Storage for Completed Task Images
const completedStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'waste_reports/completed_tasks', // 🔹 Store completed images in a separate folder
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const uploadReport = multer({ storage: reportStorage });
const uploadCompleted = multer({ storage: completedStorage });

// ✅ Routes
router.post('/report', authMiddleware, uploadReport.single('image'), wasteReportController.reportWaste);
router.get('/my-reward-points', authMiddleware, wasteReportController.getRewardPoints);
router.get('/all-reports', authMiddleware, wasteReportController.getAllReports);
router.get('/my-reports', authMiddleware, wasteReportController.getMyReports);

// ✅ Updated Complete Task Route with Image Upload
router.post('/complete', authMiddleware, uploadCompleted.single('completedImage'), wasteReportController.completeTaskWithImage);

router.get("/worker/:workerId", authMiddleware, wasteReportController.getWasteReportsByWorkerId);

module.exports = router;
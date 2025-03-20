const WasteReport = require('../models/WasteReport');
const User = require('../models/AuthUser');
const Worker = require("../models/worker");
const mongoose = require("mongoose");
const { sendCompletionEmail } = require("../utils/emailService");

exports.reportWaste = async (req, res) => {
    try {
        console.log("🔹 Incoming Waste Report Request");
        console.log("🔹 User ID from Auth Middleware:", req.user?.id);
        console.log("🔹 Request Body:", req.body);
        console.log("🔹 Uploaded File:", req.file?.path || "No file uploaded");

        const { description, latitude, longitude,address } = req.body;

        // ✅ Validate Image Upload
        if (!req.file) {
            return res.status(400).json({ error: "Image upload is required." });
        }

        // ✅ Validate Required Fields
        if (!description || !latitude || !longitude) {
            return res.status(400).json({ error: "Description and location are required." });
        }

        // ✅ Parse & Validate Coordinates
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: "Invalid latitude or longitude." });
        }

        // ✅ Find the first available worker (FCFS - oldest available worker first)
        const availableWorker = await Worker.findOneAndUpdate(
            { status: "available" },
            { status: "busy" },
            { new: true, sort: { createdAt: 1 } } 
        );

        // ✅ Assign Worker or Mark as Pending
        const assignedWorker = availableWorker ? availableWorker._id : null;
        const status = availableWorker ? "assigned" : "waiting to assign";

        // ✅ Create the Waste Report
        const wasteReport = new WasteReport({
            userId: req.user.id,
            description,
            imageUrl: req.file.path,
            location: { latitude: lat, longitude: lon },
            address: address || "Unknown Address",
            assigned: assignedWorker,
            status,
            pointsEarned: 10,
        });

        await wasteReport.save();

        // ✅ Log Assigned Worker Details
        if (availableWorker) {
            console.log(`✅ Assigned Worker: ${availableWorker.name} (ID: ${availableWorker._id})`);
        } else {
            console.log("⚠️ No workers available. Waste report is waiting for assignment.");
        }

        // ✅ Update User Reward Points
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { rewardPoints: 10 } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "✅ Waste reported successfully!",
            wasteReport,
            assignedWorker: availableWorker ? { id: availableWorker._id, name: availableWorker.name } : null,
            newRewardPoints: updatedUser?.rewardPoints || 0,
        });

    } catch (error) {
        console.error("❌ Waste Report Error:", error);
        res.status(500).json({ error: "Server Error", details: error.message });
    }
};

// ✅ Fetch All Reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await WasteReport.find()
        .populate({ path: 'userId', model: 'User', select: 'name email' })
        .populate({ path: 'assigned', model: 'Worker', select: 'name email' }) 
        .select('location description image status userId assigned createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (err) {
        console.error('❌ Fetch Reports Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

// ✅ Fetch Reports Assigned to Logged-in Worker



exports.getWasteReportsByWorkerId = async (req, res) => {
    try {
        const { workerId } = req.params;

        // ✅ Validate if workerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ success: false, error: "Invalid Worker ID" });
        }

        // ✅ Find all waste reports assigned to the given workerId
        const wasteReports = await WasteReport.find({ assigned: workerId });

        if (!wasteReports.length) {
            return res.status(404).json({ success: false, error: "No waste reports found for this worker" });
        }

        res.status(200).json({ success: true, wasteReports });
    } catch (error) {
        console.error("❌ Error fetching waste reports:", error);
        res.status(500).json({ success: false, error: "Server Error", details: error.message });
    }
};
exports.completeTaskWithImage = async (req, res) => {
    try {
        const workerId = req.user.id; // Get worker ID from auth token

        console.log("🔹 Worker Completing Task:", workerId);
        console.log("🔹 Uploaded File:", req.file?.path || "No file uploaded");

        // ✅ Ensure an image was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Completion image is required." });
        }

        // ✅ Find the assigned task for this worker
        const wasteReport = await WasteReport.findOne({
            assigned: workerId,
            status: "assigned"
        }).populate({ path: "userId", model: "User", select: "email" });

        if (!wasteReport) {
            return res.status(404).json({ success: false, error: "No assigned task found for this worker." });
        }
        console.log("🛠 Full User Data:", wasteReport.userId); // Debugging

        // ✅ Ensure user email exists
        if (!wasteReport.userId?.email) {
            console.error("❌ User email not found. Email will not be sent.");
        }
        // ✅ Save Cloudinary completed image URL to the report
        wasteReport.status = "completed";
        wasteReport.completedImage = req.file.path; // ✅ Cloudinary image URL
        await wasteReport.save();

        // ✅ Free up the worker and add them back to the queue
        const worker = await Worker.findByIdAndUpdate(
            workerId,
            { status: "available" },
            { new: true }
        );

        console.log(`✅ Worker ${worker?.name} is now available again.`);

        // ✅ Attempt to send email only if user email exists
        if (wasteReport.userId?.email) {
            try {
                console.log("📧 Sending email to:", wasteReport.userId.email);
                await sendCompletionEmail(wasteReport.userId.email, wasteReport._id, wasteReport.completedImage);
                console.log("✅ Email sent successfully to:", wasteReport.userId.email);
            } catch (emailError) {
                console.error("❌ Email sending failed:", emailError);
            }
        }
        res.status(200).json({
            success: true,
            message: "Task completed successfully! Email sent to user.",
            updatedReport: wasteReport
        });

    } catch (error) {
        console.error("❌ Task Completion Error:", error);
        res.status(500).json({ success: false, error: "Server Error", details: error.message });
    }
};
// ✅ Fetch Reports Created by Logged-in User
exports.getMyReports = async (req, res) => {
    try {
        const userReports = await WasteReport.find({ userId: req.user.id })
            .select('description imageUrl location status assigned createdAt pointsEarned')
            .populate('assigned', 'name email') // ✅ Ensure worker details are included
            .sort({ createdAt: -1 });

        res.status(200).json(userReports);
    } catch (err) {
        console.error('❌ Fetch User Reports Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

// ✅ Get User's Reward Points
exports.getRewardPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('rewardPoints');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ rewardPoints: user.rewardPoints });
  } catch (err) {
    console.error('❌ Fetch Reward Points Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};

// ✅ Mark Task as Completed
exports.completeTask = async (req, res) => {
    try {
        const { reportId } = req.body;

        const wasteReport = await WasteReport.findById(reportId);
        if (!wasteReport || wasteReport.status !== 'assigned') {
            return res.status(400).json({ error: 'Invalid or unassigned report.' });
        }

        // ✅ Mark the report as completed
        wasteReport.status = 'completed';
        await wasteReport.save();

        // ✅ Free up the worker and add them back to the queue
        const worker = await Worker.findByIdAndUpdate(
            wasteReport.assigned,
            { status: 'available' }, // Set back to available
            { new: true }
        );

        if (!worker) {
            return res.status(404).json({ error: 'Assigned worker not found.' });
        }

        console.log(`✅ Worker ${worker.name} is now available for new tasks.`);

        res.status(200).json({ message: 'Task completed. Worker is now available again.' });

    } catch (err) {
        console.error('❌ Task Completion Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};
//feedback submission
exports.submitFeedback = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { rating, comment } = req.body;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        // Find the waste report
        const wasteReport = await WasteReport.findById(reportId);
        if (!wasteReport) {
            return res.status(404).json({ error: "Waste report not found." });
        }

        // Check if the task is completed before allowing feedback
        if (wasteReport.status !== "completed") {
            return res.status(400).json({ error: "Feedback can only be submitted for completed tasks." });
        }

        // Update the feedback
        wasteReport.feedback = { rating, comment };
        await wasteReport.save();

        res.status(200).json({ success: true, message: "Feedback submitted successfully.", wasteReport });
    } catch (error) {
        console.error("❌ Feedback Submission Error:", error);
        res.status(500).json({ error: "Server Error", details: error.message });
    }
};
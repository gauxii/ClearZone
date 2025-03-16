const WasteReport = require('../models/WasteReport');
const User = require('../models/AuthUser');
const Worker = require("../models/worker");

exports.reportWaste = async (req, res) => {
    try {
        console.log("🔹 User ID from authMiddleware:", req.user);
        console.log("🔹 Request Body:", req.body);
        console.log("🔹 Uploaded File:", req.file);

        const { description, latitude, longitude } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image upload is required' });
        }

        if (!description || !latitude || !longitude) {
            return res.status(400).json({ error: 'Description and location are required.' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude.' });
        }

        // ✅ Find the first available worker (FCFS order: oldest available worker first)
        const availableWorker = await Worker.findOneAndUpdate(
            { status: 'available' }, // Find a worker who is free
            { status: 'busy' }, // Mark as busy (assigned)
            { new: true, sort: { createdAt: 1 } } // Sort by oldest available worker (FCFS)
        );

        // ✅ Determine assignment details
        let assignedWorker = availableWorker ? availableWorker._id : null;
        let status = availableWorker ? 'assigned' : 'waiting to assign';

        // ✅ Create the waste report
        const wasteReport = new WasteReport({
            userId: req.user.id,
            description,
            imageUrl: req.file.path,
            location: { latitude: lat, longitude: lon },
            assigned: assignedWorker,
            status: status,
            pointsEarned: 10
        });

        await wasteReport.save();

        // ✅ Log assigned worker details
        if (availableWorker) {
            console.log(`✅ Worker Assigned: ${availableWorker.name} (ID: ${availableWorker._id})`);
        } else {
            console.log("⚠️ No workers available, waste report is waiting to be assigned.");
        }

        // ✅ Update user reward points
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { rewardPoints: 10 } },
            { new: true }
        );

        res.status(201).json({
            message: '✅ Waste reported successfully!',
            wasteReport,
            assignedWorker: availableWorker
                ? { id: availableWorker._id, name: availableWorker.name }
                : null, // Send worker details if assigned
            newRewardPoints: updatedUser.rewardPoints
        });

    } catch (err) {
        console.error('❌ Waste Report Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

// ✅ Fetch All Reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await WasteReport.find()
            .populate('userId', 'name email')
            .populate('assigned', 'name email') // ✅ Ensure worker details are included
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (err) {
        console.error('❌ Fetch Reports Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

// ✅ Fetch Reports Assigned to Logged-in Worker
exports.getWorkerReports = async (req, res) => {
    try {
        const workerId = req.user.id; // Assuming worker authentication stores ID in `req.user.id`

        const workerReports = await WasteReport.find({ assigned: workerId, status: 'assigned' })
            .select('description imageUrl location status assigned createdAt')
            .populate('userId', 'name email') // Populate citizen details
            .sort({ createdAt: -1 });

        res.status(200).json(workerReports);
    } catch (err) {
        console.error('❌ Fetch Worker Reports Error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
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
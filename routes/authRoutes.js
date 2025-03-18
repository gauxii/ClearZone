const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/AuthUser');
const Worker = require('../models/worker');
const Admin = require('../models/admin');

const router = express.Router();

// ✅ User Login
router.post('/login/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated JWT Token:", token);
    res.status(200).json({ message: '✅ User login successful', token, name: user.name });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Worker Login (🔹 Now returns worker name)
router.post('/login/worker', async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    const worker = await Worker.findOne({ employeeId });
    if (!worker) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: worker._id, employeeId: worker.employeeId, role: "worker" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: '✅ Worker login successful', 
      token, 
      _id: worker._id,  // ✅ Added _id to response
      name: worker.name, 
      employeeId: worker.employeeId 
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Admin Login (🔹 Now returns admin name)
router.post('/login/admin', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, adminId: admin.adminId, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: '✅ Admin login successful', token, name: admin.name });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});
// ✅ User Signup
router.post('/signup/user', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ User signup successful!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// ✅ Worker Signup
router.post('/signup/worker', async (req, res) => {
  const { name, employeeId, password } = req.body;

  try {
    if (!name || !employeeId || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingWorker = await Worker.findOne({ employeeId });
    if (existingWorker) {
      return res.status(400).json({ error: "Employee ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({ name, employeeId, password: hashedPassword });
    await newWorker.save();

    res.status(201).json({ message: "✅ Worker signup successful!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// ✅ Admin Signup
router.post('/signup/admin', async (req, res) => {
  const { name, adminId, password } = req.body;

  try {
    if (!name || !adminId || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, adminId, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "✅ Admin signup successful!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;
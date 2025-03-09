const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Worker = require('../models/worker');
const Admin = require('../models/admin');

const router = express.Router();

// ✅ User Signup
router.post('/signup/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: '✅ User created successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Worker Signup
router.post('/signup/worker', async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    if (!/^EMP\d+$/.test(employeeId)) {
      return res.status(400).json({ error: "Employee ID must start with 'EMP' followed by numbers." });
    }

    const workerExists = await Worker.findOne({ employeeId });
    if (workerExists) return res.status(400).json({ error: 'Worker already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const worker = new Worker({ employeeId, password: hashedPassword });
    await worker.save();

    res.status(201).json({ message: '✅ Worker created successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Admin Signup
router.post('/signup/admin', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    if (!/^ADMIN\d+$/.test(adminId)) {
      return res.status(400).json({ error: "Admin ID must start with 'ADMIN' followed by numbers." });
    }

    const adminExists = await Admin.findOne({ adminId });
    if (adminExists) return res.status(400).json({ error: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ adminId, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: '✅ Admin created successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ User Login
router.post('/login/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: '✅ User login successful', token });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Worker Login
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

    res.status(200).json({ message: '✅ Worker login successful', token });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ Admin Login
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

    res.status(200).json({ message: '✅ Admin login successful', token });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;

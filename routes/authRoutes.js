const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthUser = require('../models/AuthUser');

const router = express.Router();

// ✅ User Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await AuthUser.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const authUser = new AuthUser({ email, password: hashedPassword });
    await authUser.save();

    res.status(201).json({ message: '✅ User created successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// ✅ User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const authUser = await AuthUser.findOne({ email });
    if (!authUser) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, authUser.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: authUser._id, email: authUser.email },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: '✅ Login successful', token });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;

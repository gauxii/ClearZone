const express = require('express'); // Importing Express
const mongoose = require('mongoose'); // Importing Mongoose
require('dotenv').config(); // Load environment variables from a .env file
const AuthUser = require('./models/AuthUser'); // Import the AuthUser model
const User = require('./models/User'); // Import the User model

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Atlas connection string from the environment variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://gauxii:gauri071016@cluster0.qynps.mongodb.net/ClearZone?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB Atlas', err));

// Route to create a new authentication user (sign-up)
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await AuthUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const authUser = new AuthUser({ email, password });
    await authUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error creating user', details: err });
  }
});

// Route to authenticate user (login)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const authUser = await AuthUser.findOne({ email });
    if (!authUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await authUser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ error: 'Error logging in', details: err });
  }
});

// Define a port
const PORT = process.env.PORT || 5002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

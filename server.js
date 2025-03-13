require('dotenv').config(); // ✅ Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const wasteRoutes = require("./routes/wasteReports"); // Import waste routes
const leaderboardRoutes = require("./routes/leaderboardRoutes"); // ✅ Import leaderboard routes

const app = express();

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Could not connect to MongoDB Atlas', err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/leaderboard", leaderboardRoutes); // ✅ Add leaderboard route here

// ✅ Start the Server
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

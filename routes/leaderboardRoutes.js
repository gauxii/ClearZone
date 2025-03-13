const express = require("express");
const User = require("../models/AuthUser"); // Import User Model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Fetch Top 10 Users by Reward Points (Leaderboard)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leaderboard = await User.find({}, "name rewardPoints")
      .sort({ rewardPoints: -1 }) // Sort by highest points
      .limit(10); // Show top 10 users

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

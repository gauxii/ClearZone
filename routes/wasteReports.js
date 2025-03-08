const express = require("express");
const router = express.Router();

// Sample route
router.get("/waste", (req, res) => {
  res.json({ message: "Waste Reports API is working!" });
});

// Export the router
module.exports = router;

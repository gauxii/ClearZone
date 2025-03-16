const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            console.log("❌ No token provided");
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔍 Token Received:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", decoded);

        req.user = decoded; // Ensure decoded token has workerId
        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        return res.status(400).json({ error: "Invalid token" });
    }
};
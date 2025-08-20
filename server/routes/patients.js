const express = require("express");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Only doctors can fetch all patients
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ error: "Only doctors can view patients" });
    }

    const patients = await User.find({ role: "patient" }).select("-password");
    res.json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

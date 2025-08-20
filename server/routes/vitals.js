const express = require('express');
const Vital = require('../models/Vital');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Patient can view their own vitals history
router.get('/my', authMiddleware, async (req, res) => {
  const patientId = req.user.id;
  const history = await Vital.find({ patientId }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ success: true, history });
});

// Doctor can view any patient's vitals history
router.get('/history/:patientId', authMiddleware, requireRole('doctor'), async (req, res) => {
  const { patientId } = req.params;
  const history = await Vital.find({ patientId }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ success: true, history });
});

module.exports = router;

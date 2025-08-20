const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { config } = require('../config');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ username, email, passwordHash, role });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, role: user.role, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role, username: user.username, email: user.email },
    config.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({
    success: true,
    token,
    user: { id: user._id, role: user.role, username: user.username, email: user.email }
  });
});

router.get('/users', authMiddleware, requireRole('doctor'), async (req, res) => {
  const { role } = req.query;
  const query = role ? { role } : {};
  const users = await User.find(query).select('_id username email role').lean();
  res.json({ success: true, users });
});

module.exports = router;

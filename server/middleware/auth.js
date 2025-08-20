const jwt = require('jsonwebtoken');
const { config } = require('../config');
const User = require('../models/User');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

function requireRole(role) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).lean();
      if (!user || user.role !== role) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      next();
    } catch {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
}

async function authSocket(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('No token'));
    const decoded = jwt.verify(token, config.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
}

module.exports = { authMiddleware, requireRole, authSocket };

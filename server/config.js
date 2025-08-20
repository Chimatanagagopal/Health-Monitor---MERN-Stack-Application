const dotenv = require('dotenv');
dotenv.config();

const config = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/health_monitoring',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  PORT: process.env.PORT || 5000,
  ORIGIN: process.env.ORIGIN || 'http://localhost:5173'
};

module.exports = { config };

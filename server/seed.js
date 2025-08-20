import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import User from './models/User.js';

async function run() {
  await mongoose.connect(config.MONGODB_URI);
  console.log('Mongo connected');
  const users = [
    { username: 'Dr. Strange', email: 'doctor@demo.com', role: 'doctor', password: 'demo123' },
    { username: 'Alice', email: 'alice@demo.com', role: 'patient', password: 'demo123' },
    { username: 'Bob', email: 'bob@demo.com', role: 'patient', password: 'demo123' },
  ];
  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await User.create({ username: u.username, email: u.email, role: u.role, passwordHash });
      console.log('Created', u.email);
    } else {
      console.log('Exists', u.email);
    }
  }
  await mongoose.disconnect();
  console.log('Done.');
}
run().catch(e => { console.error(e); process.exit(1); });

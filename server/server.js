const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const { config } = require('./config');
const authRoutes = require('./routes/auth');
const vitalsRoutes = require('./routes/vitals');
const { authSocket } = require('./middleware/auth');
const Vital = require('./models/Vital');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors({ origin: config.ORIGIN, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes);

app.get('/', (req, res) => res.json({ ok: true }));
const patientsRoutes = require("./routes/patients");
app.use("/api/patients", patientsRoutes);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: config.ORIGIN, methods: ['GET','POST'] } });

io.use(authSocket);

io.on('connection', (socket) => {
  const user = socket.user;
  if (!user) return;
  if (user.role === 'patient') socket.join(`patient:${user.id}`);
  else if (user.role === 'doctor') socket.join('doctors');
  socket.emit('connected', { message: 'Socket connected', role: user.role });
});

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

async function generateAndBroadcastVitals() {
  try {
    const patients = await User.find({ role: 'patient' }).lean();
    const docsPayload = [];
    for (const p of patients) {
      const vital = {
        patientId: p._id,
        heartRate: Math.floor(randomBetween(55, 110)),
        spo2: Math.floor(randomBetween(88, 99)),
        temperature: randomBetween(35.5, 39.5),
        bpSys: Math.floor(randomBetween(85, 150)),
        bpDia: Math.floor(randomBetween(55, 100)),
        createdAt: new Date()
      };
      await Vital.create(vital);
      io.to(`patient:${p._id}`).emit('vitals', vital);
      docsPayload.push({ ...vital, patient: { _id: p._id, username: p.username, email: p.email } });
    }
    if (docsPayload.length) io.to('doctors').emit('vitals-batch', docsPayload);
  } catch (err) {
    console.error('Generator error:', err.message);
  }
}

setInterval(generateAndBroadcastVitals, 5000);

async function start() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected');
    server.listen(config.PORT, () => console.log('Server running on', config.PORT));
  } catch (e) {
    console.error('Startup error', e);
    process.exit(1);
  }
}
start();

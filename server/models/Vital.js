const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: Number,
  spo2: Number,
  temperature: Number,
  bpSys: Number,
  bpDia: Number,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

vitalSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Vital', vitalSchema);

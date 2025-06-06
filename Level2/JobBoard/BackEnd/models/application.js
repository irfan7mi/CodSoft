const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  jobId: { type: String, required: true },
  status: { type: String, default: 'Under Review', enum: ['Under Review', 'Interview Scheduled', 'Hired', 'Rejected'] },
  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
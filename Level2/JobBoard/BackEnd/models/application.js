const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'Under Review', enum: ['Under Review', 'Interview Scheduled', 'Hired', 'Rejected'] },
  appliedDate: { type: Date, default: Date.now },
  resume: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
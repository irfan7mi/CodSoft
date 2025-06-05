const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'candidate' },
  location: { type: String },
  title: { type: String },
  experience: { type: String },
  skills: [{ type: String }],
  summary: { type: String },
  application: { type: Object },
  resume: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', userSchema);
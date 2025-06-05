const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'candidate' },
  location: { type: String, required: true },
  title: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [{ type: String }],
  summary: { type: String },
  application: { type: Object },
  resume: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', userSchema);
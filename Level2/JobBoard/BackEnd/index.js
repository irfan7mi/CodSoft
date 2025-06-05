const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const jobRoutes = require('./routes/jobRoute');
const applnRoutes = require('./routes/applnRoute');
const savedJobRoutes = require('./routes/savedJobRoute');
const url = process.env.MONGO_URI || 'mongodb+srv://mi2268242:q0zQ2HuspFPfohf0@doorfood.gxuxa.mongodb.net/?retryWrites=true&w=majority&appName=bazario';

const app = express();

app.use(cors({
  origin: 'https://job-board-client-blond.vercel.app',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('DB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/application', applnRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
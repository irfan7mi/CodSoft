const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const jobRoutes = require('./routes/jobRoute');
const applnRoutes = require('./routes/applnRoute');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/users');
const url = process.env.MONGO_URI || 'mongodb+srv://mi2268242:q0zQ2HuspFPfohf0@doorfood.gxuxa.mongodb.net/?retryWrites=true&w=majority&appName=bazario';
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to DooRFooD API!' });
});

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/application', applnRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
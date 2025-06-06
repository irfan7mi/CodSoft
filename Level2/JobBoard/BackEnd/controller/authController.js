const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/users');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || "random#secret"
const validator = require('validator');
const fs = require('fs');
const upload = require('../middleware/upload');
const { log } = require('console');

const signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name ||!email ||!password ||!mobile ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (await Candidate.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = new Candidate({
      name,
      email,
      password: hashedPassword,
      mobile
    });
    await newCandidate.save();
    const token = jwt.sign({ userId: newCandidate._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  }
  catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Server error while signing up' });
  }
}

const login = async (req, res) => {
  try{
    const { email, password } = req.body;
    if (!email ||!password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: candidate._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: candidate });
  }
  catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error while logging in' });
  }
}

const getProfile = async (req, res) => {
  try {
    const email = req.query.email;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: candidate });
    console.log(candidate);
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile, location, title, experience, skills, summary } = req.body;

    if (!name || !email || !mobile || !location || !title || !experience || !summary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    const updatedUser = await Candidate.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        email,
        mobile,
        location,
        title,
        experience,
        skills: skillsArray,
        summary
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const uploadResume = [
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const resumePath = `/uploads/resumes/${req.file.filename}`;
      const updatedUser = await Candidate.findByIdAndUpdate(
        req.user.userId,
        { resume: resumePath },
        { new: true }
      ).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Resume uploaded successfully', user: updatedUser });
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ message: 'Server error while uploading resume' });
    }
  }
];

module.exports = { signup, login, getProfile, updateProfile };
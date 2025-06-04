const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');

const signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      role: 'candidate' 
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'your_jwt_secret', {
      expiresIn: '1h'
    });

    res.status(201).json({
      user: { name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'your_jwt_secret', {
      expiresIn: '1h'
    });

    res.status(200).json({
      user: { name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
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

    const updatedUser = await User.findByIdAndUpdate(
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
      const updatedUser = await User.findByIdAndUpdate(
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

module.exports = { signup, login, getProfile, updateProfile, uploadResume };
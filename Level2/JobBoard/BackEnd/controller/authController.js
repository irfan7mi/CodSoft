const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/users');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');

const signup1 = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const existingUser = await Candidate.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const candidate = new Candidate({
      name,
      mobile,
      email,
      password: hashedPassword,
      role: 'candidate' 
    });

    await candidate.save();

    const token = jwt.sign({ userId: candidate._id, email: candidate.email, role: candidate.role }, "random#secret", {
      expiresIn: '1h'
    });

    res.status(201).json({
      user: { name: candidate.name, email: candidate.email, role: candidate.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const createToken = (id) => {
  return jwt.sign({id}, JWT_SECRET)
}

const signup = async (req, res) => {
  const {name, mobile, email, password} = req.body
  try{
    const existingUser = await Candidate.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter valid email address!"})
    }
    if (password.length<8) {
      return res.json({success:false, message:"Please enter strong password!"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new Candidate({
      name: name,
      mobile: mobile,
      email: email,
      password: hashedPassword,
      role: 'candidate',
      cartData: []
    })
    let candidate = await newUser.save()
    const token = createToken(candidate._id)
    return res.send({user: { name: candidate.name, email: candidate.email, role: candidate.role },
      token})
  }
  catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
    console.error("Signup Error:", err); 
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: candidate._id, email: candidate.email, role: candidate.role }, 'your_jwt_secret', {
      expiresIn: '1h'
    });

    res.status(200).json({
      user: { name: candidate.name, email: candidate.email, role: candidate.role },
      token
    });
  } catch (error) {
    console.error('Server Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.candidate.userId).select('-password');
    if (!candidate) {
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
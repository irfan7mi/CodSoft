const Job = require('../models/jobs');
const Application = require('../models/application');

const postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      type,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
      duration,
      contact
    } = req.body;

    if (!title || !company || !location || !salary || !type || !description || !requirements) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const responsibilitiesArray = responsibilities ? responsibilities.split(',').map(item => item.trim()) : [];
    const requirementsArray = requirements ? requirements.split(',').map(item => item.trim()) : [];
    const skillsArray = skills ? skills.split(',').map(item => item.trim()) : [];
    const benefitsArray = benefits ? benefits.split(',').map(item => item.trim()) : [];

    const job = new Job({
      title,
      company,
      location,
      salary,
      type,
      description,
      responsibilities: responsibilitiesArray,
      requirements: requirementsArray,
      skills: skillsArray,
      benefits: benefitsArray,
      duration: duration || 'Permanent',
      contact,
      postedBy: req.user.userId, 
      posted: new Date()
    });

    await job.save();

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error while posting job' });
  }
};

const listJob = async (req, res) => {
  try{
    const jobs = await Job.find().select('title company location salary type posted skills');
    res.status(200).json({jobs});
  }
  catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
}

const viewJob = async (req, res) => {
  try{
    const job = await Job.findById(req.params.id);
    if(!job){
      res.status(404).json({message: 'Job not found'});
    }
    res.status(200).json({job});
  }
  catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
}

const updateJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      type,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
      duration,
      contact
    } = req.body;

    if (!title || !company || !location || !salary || !type || !description || !requirements) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const responsibilitiesArray = responsibilities ? responsibilities.split(',').map(item => item.trim()) : [];
    const requirementsArray = requirements ? requirements.split(',').map(item => item.trim()) : [];
    const skillsArray = skills ? skills.split(',').map(item => item.trim()) : [];
    const benefitsArray = benefits ? benefits.split(',').map(item => item.trim()) : [];

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.userId },
      {
        title,
        company,
        location,
        salary,
        type,
        description,
        responsibilities: responsibilitiesArray,
        requirements: requirementsArray,
        skills: skillsArray,
        benefits: benefitsArray,
        duration: duration || 'Permanent',
        contact
      },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await Application.deleteMany({ job: req.params.id });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};

const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const existingSavedJob = await SavedJob.findOne({ user: req.user.userId, job: jobId });
    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    const savedJob = new SavedJob({
      user: req.user.userId,
      job: jobId
    });
    await savedJob.save();
    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: 'Server error while saving job' });
  }
};

module.exports = { postJob, listJob, viewJob, updateJob, deleteJob, saveJob };
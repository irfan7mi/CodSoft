const Application = require('../models/application');
const Job = require('../models/jobs');

const listApplications = async (req, res) => {
  try {
    const email = req.params.email;
    const applications = await Application.find({ email })
    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this email' });
    }
    const jobId = applications.map(app => app.jobId);
    const job = await Job.findById(jobId);
    res.status(200).json({ applications, job });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};

const applyJob = async (req, res) => {
  try {
    const { jobId, userId, email } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const existingApplication = await Application.findOne({jobId});
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    const application = new Application({
      userId,
      jobId,
      email
    });
    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });
    await application.populate('job', 'title company salary');
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error while applying for job' });
  }
};

module.exports = { listApplications, applyJob };
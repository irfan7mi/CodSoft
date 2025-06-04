const Application = require('../models/application');
const Job = require('../models/jobs');

const listApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name experience')
      .populate('job', 'title');

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const existingApplication = await Application.findOne({ candidate: req.user.userId, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    const application = new Application({
      candidate: req.user.userId,
      job: jobId,
      resume: (await User.findById(req.user.userId)).resume
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
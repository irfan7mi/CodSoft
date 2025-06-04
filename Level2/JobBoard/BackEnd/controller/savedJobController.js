const SavedJob = require('../models/savedJobs');

const listSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.userId }).populate('job', 'title company location salary');
    res.status(200).json({ savedJobs });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ message: 'Server error while fetching saved jobs' });
  }
};

const removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({ user: req.user.userId, job: req.params.jobId });
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    res.status(200).json({ message: 'Saved job removed successfully' });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ message: 'Server error while removing saved job' });
  }
};

module.exports = { listSavedJobs, removeSavedJob };
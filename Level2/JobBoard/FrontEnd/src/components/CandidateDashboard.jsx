import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    title: '',
    experience: '',
    skills: [],
    summary: ''
  });
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your dashboard.');
          return;
        }

        const profileResponse = await axios.get('https://codsoft-fctc.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          name: profileResponse.data.user.name || '',
          email: profileResponse.data.user.email || '',
          mobile: profileResponse.data.user.mobile || '',
          location: profileResponse.data.user.location || '',
          title: profileResponse.data.user.title || '',
          experience: profileResponse.data.user.experience || '',
          skills: profileResponse.data.user.skills || [],
          summary: profileResponse.data.user.summary || ''
        });

        const applicationsResponse = await axios.get('https://codsoft-fctc.onrender.com/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(applicationsResponse.data.applications.map(app => ({
          id: app._id,
          jobTitle: app.job.title,
          company: app.job.company,
          appliedDate: new Date(app.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          status: app.status,
          salary: app.job.salary,
          jobId: app.job._id
        })));

        const savedJobsResponse = await axios.get('https://codsoft-fctc.onrender.com/api/saved-jobs/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(savedJobsResponse.data.savedJobs.map(saved => ({
          id: saved._id,
          title: saved.job.title,
          company: saved.job.company,
          location: saved.job.location,
          salary: saved.job.salary,
          savedDate: new Date(saved.savedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          jobId: saved.job._id
        })));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfile({
      ...profile,
      skills: skillsArray
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to update your profile');
      }
      const response = await axios.post('https://codsoft-fctc.onrender.com/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        mobile: response.data.user.mobile,
        location: response.data.user.location,
        title: response.data.user.title,
        experience: response.data.user.experience,
        skills: response.data.user.skills,
        summary: response.data.user.summary
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to upload a resume');
      }
      if (!resume) {
        throw new Error('Please select a resume file');
      }
      const formData = new FormData();
      formData.append('resume', resume);
      await axios.post('https://codsoft-fctc.onrender.com/api/auth/upload-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Resume uploaded successfully!');
      setResume(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload resume. Please try again.');
      console.error('Error uploading resume:', error);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to withdraw an application.');
        return;
      }
      await axios.delete(`https://codsoft-fctc.onrender.com/api/applications/withdraw/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.filter(app => app.id !== applicationId));
      setSuccess('Application withdrawn successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to withdraw application. Please try again.');
      console.error('Error withdrawing application:', error);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to apply for a job.');
        return;
      }
      const response = await axios.post('https://codsoft-fctc.onrender.com/api/applications/apply', { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications([...applications, {
        id: response.data.application._id,
        jobTitle: response.data.application.job.title,
        company: response.data.application.job.company,
        appliedDate: new Date(response.data.application.appliedDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        status: response.data.application.status,
        salary: response.data.application.job.salary,
        jobId: response.data.application.job._id
      }]);
      setSavedJobs(savedJobs.filter(saved => saved.jobId !== jobId));
      setSuccess('Application submitted successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to apply for job. Please try again.');
      console.error('Error applying for job:', error);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to remove a saved job.');
        return;
      }
      await axios.delete(`https://codsoft-fctc.onrender.com/api/saved-jobs/remove/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(saved => saved.jobId !== jobId));
      setSuccess('Job removed from saved list!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove saved job. Please try again.');
      console.error('Error removing saved job:', error);
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="profile-summary">
        <div className="profile-header">
          <div className="profile-info">
            <h2>{profile.name || 'User'}</h2>
            <p className="profile-title">{profile.title || 'No title'}</p>
            <p className="profile-location">📍 {profile.location || 'No location'}</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Total Applications</p>
          <span className="stat-change positive">+{applications.length} this week</span>
        </div>
        <div className="stat-card">
          <h3>{applications.filter(app => app.status === 'Interview Scheduled').length}</h3>
          <p>Interviews Scheduled</p>
          <span className="stat-change positive">+{applications.filter(app => app.status === 'Interview Scheduled').length} this week</span>
        </div>
        <div className="stat-card">
          <h3>{savedJobs.length}</h3>
          <p>Saved Jobs</p>
          <span className="stat-change neutral">No change</span>
        </div>
        <div className="stat-card">
          <h3>{Math.round((Object.values(profile).filter(v => v && v.length > 0).length / 8) * 100)}%</h3>
          <p>Profile Completion</p>
          <span className="stat-change positive">Complete your profile</span>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {applications.slice(0, 3).map(app => (
            <div key={app.id} className="activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-content">
                <p><strong>Applied to</strong> {app.jobTitle} at {app.company}</p>
                <span className="activity-time">{app.appliedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="applications-section">
      <h3>My Applications</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <h4>{app.jobTitle}</h4>
              <span className={`application-status ${app.status.toLowerCase().replace(' ', '-')}`}>
                {app.status}
              </span>
            </div>
            <div className="application-details">
              <p className="company">{app.company}</p>
              <p className="salary">{app.salary}</p>
              <p className="applied-date">Applied: {app.appliedDate}</p>
            </div>
            <div className="application-actions">
              <button className="action-btn" onClick={() => navigate(`/job/${app.jobId}`)}>View Job</button>
              <button className="action-btn" onClick={() => handleWithdrawApplication(app.id)}>Withdraw</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSavedJobs = () => (
    <div className="saved-jobs-section">
      <h3>Saved Jobs</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="saved-jobs-list">
        {savedJobs.map(job => (
          <div key={job.id} className="saved-job-card">
            <div className="job-info">
              <h4>{job.title}</h4>
              <p className="company">{job.company}</p>
              <p className="location">📍 {job.location}</p>
              <p className="salary">{job.salary}</p>
            </div>
            <div className="job-meta">
              <span className="saved-date">Saved: {job.savedDate}</span>
            </div>
            <div className="job-actions">
              <button className="action-btn primary" onClick={() => handleApplyJob(job.jobId)}>Apply Now</button>
              <button className="action-btn" onClick={() => handleRemoveSavedJob(job.jobId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <h3>My Profile</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="profile-form" onSubmit={handleProfileUpdate}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="mobile"
              value={profile.mobile}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            value={profile.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="React, JavaScript, CSS, HTML..."
          />
        </div>
        <div className="form-group">
          <label>Professional Summary</label>
          <textarea
            name="summary"
            value={profile.summary}
            onChange={handleInputChange}
            rows="4"
            placeholder="Brief description of your experience and goals..."
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn">
            Update Profile
          </button>
        </div>
      </form>
      <form className="resume-form" onSubmit={handleResumeUpload}>
        <div className="form-group">
          <label>Upload Resume</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="secondary-btn" disabled={!resume}>
            Upload Resume
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className='candidate-dashboard-page'>
      <div className="dashboard-header">
        <h1>Candidate Dashboard</h1>
        <p>Track your applications and build your profile</p>
      </div>

      <div className="dashboard-nav">
        <button
          className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'applications' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
        <button
          className={activeTab === 'saved' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('saved')}
        >
          Saved Jobs
        </button>
        <button
          className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'saved' && renderSavedJobs()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default CandidateDashboard;
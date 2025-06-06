import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = ({url, user}) => {
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
  const [jobDetails, setJobDetails] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();
  console.log(applications);
  const userEmail = user.email;
  console.log(userEmail);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your dashboard.');
          return;
        }

        const profileResponse = await axios.get(`${url}/api/auth/profile?email=${user.email}`);
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

        const applicationsResponse = await axios.get(`${url}/api/application/list/${userEmail}`);
        setApplications(applicationsResponse.data.applications);
        setJobDetails({
          title: applicationsResponse.data.job.title,
          salary: applicationsResponse.data.job.salary,
          company: applicationsResponse.data.job.company
        });
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
      const response = await axios.post(`${url}/api/auth/profile`, profile);
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

  const handleApplyJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to apply for a job.');
        return;
      }
      const response = await axios.post(`${url}/api/application/apply`, { jobId });
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
              <h4>{jobDetails.title}</h4>
              <span className={`application-status ${app.status.toLowerCase().replace(' ', '-')}`}>
                {app.status}
              </span>
            </div>
            <div className="application-details">
              <p className="company">{jobDetails.company}</p>
              <p className="salary">{jobDetails.salary}</p>
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
      <form className="resume-form">
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
          className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default CandidateDashboard;
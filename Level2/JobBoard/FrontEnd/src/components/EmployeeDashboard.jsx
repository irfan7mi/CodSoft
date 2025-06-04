import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editJobId, setEditJobId] = useState(null);
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    benefits: '',
    duration: '',
    contact: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view jobs.');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/jobs/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(response.data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          applications: job.applications,
          status: job.status,
          posted: new Date(job.posted).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        })));
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view applications.');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/applications/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data.applications.map(app => ({
          id: app._id,
          candidateName: app.candidate.name,
          position: app.job.title,
          status: app.status,
          appliedDate: new Date(app.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          experience: app.candidate.experience || 'Not specified'
        })));
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        console.error('Error fetching applications:', err);
      }
    };
    fetchApplications();
  }, []);

  const handleInputChange = (e) => {
    setNewJob({
      ...newJob,
      [e.target.name]: e.target.value
    });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to post a job');
      }

      const response = await axios.post('http://localhost:5000/api/jobs/post', newJob, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setJobs([...jobs, {
        id: response.data.job._id,
        title: response.data.job.title,
        applications: 0,
        status: 'Active',
        posted: new Date(response.data.job.posted).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }]);

      setNewJob({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: '',
        description: '',
        responsibilities: '',
        requirements: '',
        skills: '',
        benefits: '',
        duration: '',
        contact: ''
      });
      setEditJobId(null);
      setSuccess('Job posted successfully!');
      setActiveTab('job-posts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to update a job');
      }

      const response = await axios.put(`http://localhost:5000/api/jobs/update/${editJobId}`, newJob, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setJobs(jobs.map(job =>
        job.id === editJobId ? {
          id: response.data.job._id,
          title: response.data.job.title,
          applications: response.data.job.applications,
          status: response.data.job.status,
          posted: new Date(response.data.job.posted).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        } : job
      ));

      setNewJob({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: '',
        description: '',
        responsibilities: '',
        requirements: '',
        skills: '',
        benefits: '',
        duration: '',
        contact: ''
      });
      setEditJobId(null);
      setSuccess('Job updated successfully!');
      setActiveTab('job-posts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update job. Please try again.');
      console.error('Error updating job:', error);
    }
  };

  const fetchJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view job details.');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/jobs/view/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewJob({
        title: response.data.job.title,
        company: response.data.job.company,
        location: response.data.job.location,
        salary: response.data.job.salary,
        type: response.data.job.type,
        description: response.data.job.description,
        responsibilities: response.data.job.responsibilities.join(', '),
        requirements: response.data.job.requirements.join(', '),
        skills: response.data.job.skills.join(', '),
        benefits: response.data.job.benefits.join(', '),
        duration: response.data.job.duration,
        contact: response.data.job.contact
      });
      setEditJobId(jobId);
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete a job.');
        return;
      }
      await axios.delete(`http://localhost:5000/api/jobs/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(job => job.id !== jobId));
      setSuccess('Job deleted successfully!');
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Total Applications</p>
          <span className="stat-change positive">+{applications.length} this week</span>
        </div>
        <div className="stat-card">
          <h3>{jobs.filter(job => job.status === 'Active').length}</h3>
          <p>Active Job Posts</p>
          <span className="stat-change neutral">No change</span>
        </div>
        <div className="stat-card">
          <h3>{applications.filter(app => app.status === 'Interview Scheduled').length}</h3>
          <p>Interviews Scheduled</p>
          <span className="stat-change positive">+{applications.filter(app => app.status === 'Interview Scheduled').length} this week</span>
        </div>
        <div className="stat-card">
          <h3>{applications.filter(app => app.status === 'Hired').length}</h3>
          <p>Recent Hires</p>
          <span className="stat-change positive">+{applications.filter(app => app.status === 'Hired').length} this month</span>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {applications.slice(0, 3).map(app => (
            <div key={app.id} className="activity-item">
              <span className="activity-icon">📩</span>
              <div className="activity-content">
                <p><strong>New application</strong> from {app.candidateName} for {app.position}</p>
                <span className="activity-time">{app.appliedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobPosts = () => (
    <div className="job-posts-section">
      <div className="section-header">
        <h3>Your Job Posts</h3>
        <button className="primary-btn" onClick={() => { setActiveTab('post-job'); setEditJobId(null); setNewJob({ title: '', company: '', location: '', salary: '', type: '', description: '', responsibilities: '', requirements: '', skills: '', benefits: '', duration: '', contact: '' }); }}>
          + Post New Job
        </button>
      </div>
      <div className="jobs-table">
        {jobs.map(job => (
          <div key={job.id} className="job-row">
            <div className="job-info">
              <h4>{job.title}</h4>
              <span className="job-posted">Posted {job.posted}</span>
            </div>
            <div className="job-stats">
              <span className="applications-count">{job.applications} Applications</span>
              <span className={`job-status ${job.status}`}>
                {job.status}
              </span>
            </div>
            <div className="job-actions">
              <button className="action-btn" onClick={() => { setActiveTab('post-job'); fetchJob(job.id);}}>View and Edit</button>
              <button className="action-btn danger" onClick={() => handleDeleteJob(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="applications-section">
      <h3>Job Applications</h3>
      <div className="applications-table">
        {applications.map(app => (
          <div key={app.id} className="application-row">
            <div className="candidate-info">
              <div className="candidate-avatar">
                {app.candidateName.charAt(0)}
              </div>
              <div className="candidate-details">
                <h4>{app.candidateName}</h4>
                <p>{app.position}</p>
                <span className="experience">{app.experience}</span>
              </div>
            </div>
            <div className="application-meta">
              <span className="applied-date">Applied: {app.appliedDate}</span>
              <span className={`application-status ${app.status.toLowerCase().replace(' ', '-')}`}>
                {app.status}
              </span>
            </div>
            <div className="application-actions">
              <button className="action-btn">View Resume</button>
              <button className="action-btn primary">Schedule Interview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPostJob = () => (
    <div className="post-job-section">
      <h3>{editJobId ? 'Edit Job' : 'Post a New Job'}</h3>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
      <form className="job-form" onSubmit={editJobId ? handleUpdateJob : handlePostJob}>
        <div className="form-row">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={newJob.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={newJob.company}
              onChange={handleInputChange}
              placeholder="e.g., TechCorp Inc."
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={newJob.location}
              onChange={handleInputChange}
              placeholder="e.g., New York, NY"
              required
            />
          </div>
          <div className="form-group">
            <label>Salary Range</label>
            <input
              type="text"
              name="salary"
              value={newJob.salary}
              onChange={handleInputChange}
              placeholder="e.g., $80,000 - $120,000"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Job Type</label>
            <select
              name="type"
              value={newJob.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={newJob.duration}
              onChange={handleInputChange}
              placeholder="e.g., Permanent or 6 months"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="description"
            value={newJob.description}
            onChange={handleInputChange}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows="6"
            required
          />
        </div>
        <div className="form-group">
          <label>Responsibilities (comma-separated)</label>
          <textarea
            name="responsibilities"
            value={newJob.responsibilities}
            onChange={handleInputChange}
            placeholder="List key responsibilities..."
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Requirements (comma-separated)</label>
          <textarea
            name="requirements"
            value={newJob.requirements}
            onChange={handleInputChange}
            placeholder="List required skills, experience, and qualifications..."
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={newJob.skills}
            onChange={handleInputChange}
            placeholder="e.g., React, JavaScript, CSS"
            required
          />
        </div>
        <div className="form-group">
          <label>Benefits (comma-separated)</label>
          <textarea
            name="benefits"
            value={newJob.benefits}
            onChange={handleInputChange}
            placeholder="List benefits..."
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            name="contact"
            value={newJob.contact}
            onChange={handleInputChange}
            placeholder="e.g., careers@company.com"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => { setActiveTab('job-posts'); setEditJobId(null); setNewJob({ title: '', company: '', location: '', salary: '', type: '', description: '', responsibilities: '', requirements: '', skills: '', benefits: '', duration: '', contact: '' }); }}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            {editJobId ? 'Update Job' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className='emp-dashboard-page'>
      <div className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and applications</p>
      </div>

      <div className="dashboard-nav">
        <button
          className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'job-posts' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('job-posts')}
        >
          Job Posts
        </button>
        <button
          className={activeTab === 'applications' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button
          className={activeTab === 'post-job' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => { setActiveTab('post-job'); setEditJobId(null); setNewJob({ title: '', company: '', location: '', salary: '', type: '', description: '', responsibilities: '', requirements: '', skills: '', benefits: '', duration: '', contact: '' }); }}
        >
          Post New Job
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'job-posts' && renderJobPosts()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'post-job' && renderPostJob()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

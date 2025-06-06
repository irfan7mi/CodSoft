import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from'react-router-dom';

const JobList = ({ setCurrentPage, jobId, setJobId, url, setJobData}) => {
  const [isApplied, setIsApplied] = useState(false);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([
    {
      id: "",
      title: "",
      company: "",
      location: "",
      salary: "",
      type: "",
      posted: "",
      skills: []
    }
  ]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await axios.get(`${url}/api/jobs/list`);
        setJobs(response.data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type,
          posted: new Date(job.posted).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          skills: job.skills
        })));
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);  
    
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const applicationResponse = await axios.get(`${url}/api/applications/my-applications`);
        const hasApplied = applicationResponse.data.applications.some(app => app.job._id === job.id);
        setIsApplied(hasApplied);

        const savedResponse = await axios.get(`${url}/api/saved-jobs/list`);
        const hasSaved = savedResponse.data.savedJobs.some(saved => saved.job._id === job.id);
        setIsSaved(hasSaved);
      } catch (err) {
        console.error('Error checking job status:', err);
      }
    };
    checkStatus();
  }, []);

  const handleApply = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to apply for this job.');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${url}/api/applications/apply`,
        { jobId: jobs.id }
      );

      setIsApplied(true);
      setSuccess('Application submitted successfully!');
      setTimeout(() => navigate('/candidate-dashboard'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to apply for job. Please try again.');
      console.error('Error applying for job:', error);
    }
  };

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || job.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const handleJobClick = async (e, id) => {
    e.preventDefault();
    try{
      const response = await axios.get(`${url}/api/job/view/${id}`);
      console.log(response.data.job);
      setJobData(response.data.job);
      setJobId(response.data.job._id);
      setCurrentPage('job');
      navigate(`/job/${jobId}`);
    }
    catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  return (
    <div className='job-list-page'>
      <div className="job-list-header">
        <h1>Available Jobs</h1>
        <p>Discover {jobs.length} amazing job opportunities</p>
      </div>

      <div className="job-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => setFilterType('all')}
          >
            All Jobs
          </button>
          <button 
            className={filterType === 'full-time' ? 'active' : ''}
            onClick={() => setFilterType('full-time')}
          >
            Full-time
          </button>
          <button 
            className={filterType === 'part-time' ? 'active' : ''}
            onClick={() => setFilterType('part-time')}
          >
            Part-time
          </button>
          <button 
            className={filterType === 'contract' ? 'active' : ''}
            onClick={() => setFilterType('contract')}
          >
            Contract
          </button>
        </div>
      </div>

      <div className="job-list-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card" onClick={(e) => handleJobClick(e, job.id)}>
              <div className="job-card-header">
                <div className="job-title-section">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                <div className="job-posted">{job.posted}</div>
              </div>
              
              <div className="job-company-info">
                <h4>{job.company}</h4>
                <p className="job-location">📍 {job.location}</p>
              </div>
              
              <div className="job-salary">
                <span className="salary-label">Salary:</span>
                <span className="salary-amount">{job.salary}</span>
              </div>
              
              <div className="job-skills">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              
              <button className="apply-btn" onClick={handleApply} disabled={isApplied} >
                {isApplied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList
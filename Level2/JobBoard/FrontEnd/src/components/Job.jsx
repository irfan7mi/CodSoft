import React, { useState } from 'react'

const Job = ({ setCurrentPage }) => {
  const [jobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    posted: "",
    description: ``,
    responsibilities: [],
    requirements: [],
    skills: [],
    benefits: [],
    duration: "",
    contact: ""
  });

  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
  };

  const handleBackToList = () => {
    setCurrentPage('joblist');
  };

  return (
    <div className='job-page'>
      <div className="job-header">
        <button className="back-btn" onClick={handleBackToList}>
          ← Back to Job List
        </button>
        <div className="job-title-section">
          <h1>{jobData.title}</h1>
          <div className="job-meta">
            <span className="company-name">{jobData.company}</span>
            <span className="job-location">📍 {jobData.location}</span>
            <span className="job-type">{jobData.type}</span>
            <span className="job-posted">Posted {jobData.posted}</span>
          </div>
        </div>
        <div className="job-actions">
          <button 
            className={`apply-btn ${isApplied ? 'applied' : ''}`}
            onClick={handleApply}
            disabled={isApplied}
          >
            {isApplied ? '✓ Applied' : 'Apply Now'}
          </button>
          <button className="save-job-btn">💾 Save Job</button>
          <button className="share-btn">📤 Share</button>
        </div>
      </div>

      <div className="job-content">
        <div className="job-main">
          <section className="job-section">
            <h2>Job Description</h2>
            <p className="job-description">{jobData.description}</p>
          </section>

          <section className="job-section">
            <h2>Key Responsibilities</h2>
            <ul className="responsibility-list">
              {jobData.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>

          <section className="job-section">
            <h2>Requirements</h2>
            <ul className="requirement-list">
              {jobData.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section className="job-section">
            <h2>Required Skills</h2>
            <div className="skills-container">
              {jobData.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </section>

          <section className="job-section">
            <h2>Benefits & Perks</h2>
            <ul className="benefits-list">
              {jobData.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="job-sidebar">
          <div className="job-summary-card">
            <h3>Job Summary</h3>
            <div className="summary-item">
              <span className="label">Salary:</span>
              <span className="value">{jobData.salary}</span>
            </div>
            <div className="summary-item">
              <span className="label">Duration:</span>
              <span className="value">{jobData.duration}</span>
            </div>
            <div className="summary-item">
              <span className="label">Job Type:</span>
              <span className="value">{jobData.type}</span>
            </div>
            <div className="summary-item">
              <span className="label">Location:</span>
              <span className="value">{jobData.location}</span>
            </div>
          </div>

          <div className="contact-card">
            <h3>Contact Information</h3>
            <p>For any questions about this position, contact us at:</p>
            <a href={`mailto:${jobData.contact}`} className="contact-email">
              {jobData.contact}
            </a>
          </div>

          <div className="company-card">
            <h3>About {jobData.company}</h3>
            <p></p>
            <button className="company-profile-btn">View Company Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job
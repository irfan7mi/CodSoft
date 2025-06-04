import React, { useState } from 'react'

const Home = () => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    location: '',
    category: ''
  });

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchData);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      feedback: "Job Board helped me find my dream job at a top tech company. The platform is user-friendly and has amazing job opportunities!"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      feedback: "I was impressed by the quality of job listings. Found multiple interview opportunities within a week of uploading my resume."
    },
    {
      name: "Emma Davis",
      role: "UI/UX Designer",
      feedback: "The best job platform I've used! Great interface, responsive support team, and excellent job matching algorithm."
    }
  ];

  return (
    <div className='home-page'>
      <section className="hero-section">
        <div className="header-container">
          <div className="hero-stats">
            <span className="job-count">4,340+</span>
            <span className="job-label">Jobs Listed</span>
          </div>
          <h1>Find Your Dream Job</h1>
          <p className="hero-description">
            Discover thousands of job opportunities from top companies worldwide. 
            Your perfect career match is just a click away.
          </p>
          <button className="cta-button">
            <span>📄</span>
            Upload Your Resume
          </button>
        </div>
      </section>

      <section className="search-section">
        <div className="find-job-container">
          <h3>Search Your Perfect Job</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="input-wrapper">
                <span className="input-icon">🔍</span>
                <input 
                  type="text" 
                  name="keyword"
                  placeholder='Job title, keywords, or company'
                  value={searchData.keyword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input 
                  type="text" 
                  name="location"
                  placeholder='City, state, or country'
                  value={searchData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-wrapper">
                <span className="input-icon">💼</span>
                <select 
                  name="category"
                  value={searchData.category}
                  onChange={handleInputChange}
                >
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
            </div>
            <button type="submit" className="search-button">
              Find Jobs
            </button>
          </form>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Success stories from job seekers who found their perfect match</p>
        </div>
        <div className="feedback-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="feedback-card">
              <div className="card-header">
                <div className="user-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="user-info">
                  <h5>{testimonial.name}</h5>
                  <span className="user-role">{testimonial.role}</span>
                </div>
              </div>
              <p className="feedback-text">{testimonial.feedback}</p>
              <div className="rating">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>4,340+</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat-item">
            <h3>12,500+</h3>
            <p>Happy Candidates</p>
          </div>
          <div className="stat-item">
            <h3>850+</h3>
            <p>Top Companies</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
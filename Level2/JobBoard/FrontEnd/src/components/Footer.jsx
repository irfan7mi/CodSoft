import React from 'react'

const Footer = ({ setCurrentPage }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <footer className='footer-section'>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Job Board</h2>
            <p className="footer-description">
              Your gateway to amazing career opportunities. Connect with top employers 
              and find your dream job in the tech industry and beyond.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">📷</a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-list">
                <li><span onClick={() => handleNavClick('home')}>Home</span></li>
                <li><span onClick={() => handleNavClick('joblist')}>Job List</span></li>
                <li><span onClick={() => handleNavClick('job')}>Job Detail</span></li>
                <li><span onClick={() => handleNavClick('employee')}>Employer Dashboard</span></li>
                <li><span onClick={() => handleNavClick('candidate')}>Candidate Dashboard</span></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>For Job Seekers</h4>
              <ul className="footer-list">
                <li><span>Browse Jobs</span></li>
                <li><span>Career Advice</span></li>
                <li><span>Resume Builder</span></li>
                <li><span>Salary Guide</span></li>
                <li><span>Interview Tips</span></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>For Employers</h4>
              <ul className="footer-list">
                <li><span>Post a Job</span></li>
                <li><span>Search Resumes</span></li>
                <li><span>Pricing Plans</span></li>
                <li><span>Recruitment Solutions</span></li>
                <li><span>Employer Resources</span></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul className="footer-list">
                <li><span>Help Center</span></li>
                <li><span>Contact Us</span></li>
                <li><span>Privacy Policy</span></li>
                <li><span>Terms of Service</span></li>
                <li><span>Cookie Policy</span></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-contact">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div className="contact-details">
                <h5>Email Us</h5>
                <a href="mailto:support@jobboard.com">support@jobboard.com</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div className="contact-details">
                <h5>Call Us</h5>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div className="contact-details">
                <h5>Visit Us</h5>
                <p>123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Job Board. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">🔒 Secure</span>
              <span className="badge">✅ Verified</span>
              <span className="badge">⭐ Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
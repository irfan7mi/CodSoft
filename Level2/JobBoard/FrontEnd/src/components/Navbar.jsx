import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setCurrentPage, setBoolLogin, user, setUser, boolLogin, loginState }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };
  console.log(loginState);
  

  return (
    <nav className='navbar-section'>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => {handleNavClick('home'); navigate('/');}}>
          <h1>Job Board</h1>
        </div>
        
        <div className={`menu-list ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <p onClick={() => {handleNavClick('home'); navigate('/');}}>Home</p>
          <p onClick={() => {handleNavClick('joblist'); navigate('/job-list');}}>Job List</p>
          <p onClick={() => {handleNavClick('job'); navigate(`/job`);}}>Job Detail</p>
          <p onClick={() => {handleNavClick('employee'); navigate('/employee');}}>Employer Dashboard</p>
          <p onClick={() => {handleNavClick('candidate'); navigate('/candidate');}}>Candidate Dashboard</p>
        </div>
        
        <div className="navbar-auth">
          <p className="login-link" onClick={() => {setBoolLogin(true); setIsMobileMenuOpen(false); navigate('/login');}}>{!loginState ? 'Login' : 'Logout' }</p>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
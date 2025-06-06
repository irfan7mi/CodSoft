import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ boolLogin, setBoolLogin, setUser, setCurrentPage, setLoginState, url }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
      name: "",
      mobile: "",
      email: "",
      password: ""
  })

  const handleInputChange = (e) => {
      const name = e.target.name
      const value = e.target.value
      setFormData(user => ({...user, [name]:value}))
  }
  const [error, setError] = useState('');
  console.log("Email: ",formData.email);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isSignUp? '/api/auth/signup' : '/api/auth/login';
      const response = await axios.post(`${url}${endpoint}`, formData);
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setCurrentPage('home');
      setBoolLogin(false);
      setLoginState(true);
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Invalid credentials. Please try again.');
    }
  }

  return (
    <div className='login-page'>
      <div className="login-container">
        <div className="login-header">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <p>Welcome to Job Board</p>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-container">
            {isSignUp && (
              <>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder='Full Name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="tel" 
                    name="mobile"
                    placeholder='Mobile Number'
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder='Email Address'
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="login-btn">
            {isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <span 
              className="toggle-auth" 
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? ' Login' : ' Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../BackEnd/routes/authRoute';

const Login = ({ boolLogin, setBoolLogin, setUser }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const response = await axios.post(`https://codsoft-fctc.onrender.com${endpoint}`, formData);
      
      const userData = {
        name: response.data.user.name || 'John Doe',
        email: response.data.user.email,
        role: response.data.user.role || 'candidate'
      };
      localStorage.setItem('token', response.data.token);
      setUser(userData);
      setBoolLogin(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

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
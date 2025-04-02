import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiHome2Fill, RiStarFill, RiAccountCircle2Line, RiQuestionLine } from 'react-icons/ri';
import Sidebar from '../Components/Sidebar'; // Ensure you have a Sidebar component
import logo from './purrfectsitter.png'; // Ensure the logo path is correct
import '../Styles/signup.css';

const Signup = () => { 
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: '', // For capturing "owner" or "minder"
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // For success message
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, role: checked ? value : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage(''); // Clear any previous success message
  
    try {
      // Ensure a role is selected
      if (!formData.role) {
        setErrorMessage('Please select either Pet Owner or Pet Minder.');
        setLoading(false);
        return;
      }
  
      // Send signup request
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
  
      if (response.status === 201) {
        console.log('User created successfully');
        setLoading(false);
        
        // Show success message
        setSuccessMessage('Successfully created an account. Please log in with your new account.');

        // Optionally, redirect after a delay, or just let the user click the login link
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after a delay
        }, 3000);  // Delay of 3 seconds before redirecting to login page
      }
    } catch (err) {
      // Handle specific backend errors
      if (err.response && err.response.data) {
        const errorMessages = err.response.data;
        let message = '';
        // Check if the error data contains specific errors
        if (errorMessages.username) {
          message = `Username error: ${errorMessages.username}`;
        } else if (errorMessages.email) {
          message = `Email error: ${errorMessages.email}`;
        } else {
          message = 'An error occurred. Please try again.';
        }
        setErrorMessage(message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <img alt="logo" className="logo" src={logo} />
          <div className="sidebar-buttons">
            <Link to="/ownerhomepage" className="link">
              <Sidebar icon={<RiHome2Fill size={30} color="white" />} text="Home" />
            </Link>
            <Link to="/become-owner" className="link">
              <Sidebar icon={<RiStarFill size={30} color="white" />} text="Become an Owner" />
            </Link>
          </div>
        </div>
        <div className="sidebar-bottom">
          <Link to="/" className="link">
            <Sidebar icon={<RiAccountCircle2Line size={30} color="white" />} text="Sign in" />
          </Link>
          <Sidebar icon={<RiAccountCircle2Line size={30} color="white" />} text="Sign up" />
          <Sidebar icon={<RiQuestionLine size={30} color="white" />} text="Help" />
        </div>
      </div>

      {/* Signup Form */}
      <div className="signup-form">
        <div className="signup-title">Sign up to PurrfectSitter</div>

        {errorMessage && <div className="error-box">{errorMessage}</div>}
        {successMessage && <div className="success-box">{successMessage}</div>} {/* Success message */}

        <form onSubmit={handleSubmit} className="signup-form-fields">
          <div className="name-fields">
            <input
              className="form-input"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              className="form-input"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
          <input
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          
          <div className="role-selection">
            <label style={{ color: 'black' }}>
              <input 
                type="radio" 
                name="role" 
                value="owner" 
                onChange={handleChange} 
                checked={formData.role === 'owner'} 
              /> 
              Pet Owner
            </label>
            <label style={{ color: 'black' }}>
              <input 
                type="radio" 
                name="role" 
                value="minder" 
                onChange={handleChange} 
                checked={formData.role === 'minder'} 
              /> 
              Pet Minder
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="signin-link">
          Have an account?{' '}
          <Link to="/" className="link">
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

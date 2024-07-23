import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    category: ''
  });
  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/register', formData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', formData.email);
      navigate('/verification');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    const validateStep = () => {
      switch (currentStep) {
        case 1:
          const fullNameValid = /^[a-zA-Z]{3,}$/.test(formData.fullName);
          const emailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email);
          const usernameValid = /^[a-zA-Z0-9_]{4,}$/.test(formData.username);
          return fullNameValid && emailValid && usernameValid;
        case 2:
          const passwordValid = formData.password.length >= 8 &&
            /[A-Z]/.test(formData.password) &&
            /[a-z]/.test(formData.password) &&
            /[0-9]/.test(formData.password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
          return formData.phoneNumber && passwordValid && formData.password === formData.confirmPassword;
        case 3:
          return formData.dateOfBirth && formData.gender && formData.category;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep]);
  
  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div className="formsep">
          <label>Enter Your First Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {formData.fullName && !/^[a-zA-Z]{3,} $/.test(formData.fullName) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Full Name must be at least 3 characters long and contain only letters.</p>
          )}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="yourname@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formData.email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid gmail address (e.g., yourname@gmail.com).</p>
          )}

          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {formData.username && !/^[a-zA-Z0-9_]{4,}$/.test(formData.username) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Username must be at least 4 characters long and contain only letters, numbers, or underscores.</p>
          )}

          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="formsep">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="07XXXXXXXX or 01XXXXXXXX"
            pattern="(07|01)\d{8}"
            title="Please enter a valid 10-digit phone number starting with 07 or 01"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {formData.phoneNumber && !/^(07|01)\d{8}$/.test(formData.phoneNumber) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid 10-digit phone number starting with 07 or 01.</p>
          )}

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password && formData.password.length < 8 && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must be at least 8 characters long.</p>
          )}
          {formData.password && !/[A-Z]/.test(formData.password) && (
            <p style={{ color: 'red' }}>Password must contain at least one uppercase letter.</p>
          )}
          {formData.password && !/[a-z]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one lowercase letter.</p>
          )}
          {formData.password && !/[0-9]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one number.</p>
          )}
          {formData.password && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one special character.</p>
          )}

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {formData.password && formData.password !== formData.confirmPassword && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>The passwords don't match!</p>
          )}

          <button type="button" onClick={previousStep}>Back</button>
          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 3 && (
        <div className="formsep">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Seller">Seller</option>
            <option value="Salesperson">Salesperson</option>
          </select>

          <button type="button" onClick={previousStep}>Back</button>
          <button type="submit">Register</button>
        </div>
      )}

      </form>
      <div className="divmess">
          {message && <p className="message">{message}</p>}
      </div>

      <p>If you have an account <Link to="/">Login</Link></p>
    </div>
  );
};

export default Register;

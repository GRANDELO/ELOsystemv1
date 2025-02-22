import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import './styles/styles.css';
import axiosInstance from './axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    //fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    category: '',
  
  });

  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const totalSteps = 2; // Total number of steps
  const stepTimeEstimate = 2; // Estimate 2 minutes per step
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setloading(true);
    // Trim the form data before sending it
    const trimmedFormData = {
      //fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      username: formData.username.trim(),
      //dateOfBirth: formData.dateOfBirth.trim(),
      //gender: formData.gender.trim(),
      category: formData.category.trim(),
      
    };

    try {
      const response = await axiosInstance.post('/auth/register', trimmedFormData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', trimmedFormData.email);
      setloading(false);
      navigate('/verification');
    } catch (error) {
      setloading(false);
      setError(error.response?.data?.message || 'An error occurred while processing your request.');
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

          //const fullNameValid = /^[a-zA-Z]{3,}$/.test(formData.fullName.trim());
          const emailValid = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(formData.email.trim());
          const usernameValid = /^[a-zA-Z0-9_]{4,}$/.test(formData.username.trim());
          return formData.category && emailValid && usernameValid;

       
          case 2:

          const passwordValid = formData.password.trim().length >= 8 &&
            /[A-Z]/.test(formData.password.trim()) &&
            /[a-z]/.test(formData.password.trim()) &&
            /[0-9]/.test(formData.password.trim()) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password.trim());
          return formData.phoneNumber && passwordValid && formData.password === formData.confirmPassword;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep]); 

  const progressPercentage = (currentStep / totalSteps) * 100;
  const timeRemaining = stepTimeEstimate * (totalSteps - currentStep);

  return (
    <div className="container">
      <h2>Register</h2>
      <div className="progress-container">
        <p>Step {currentStep} of {totalSteps}</p>
        <p>Estimated Time Remaining: {timeRemaining} minutes</p>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>

      {currentStep === 1 && (

        <div className="formsep">
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

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="yourname@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formData.email && !/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(formData.email) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid email address (e.g., yourname@gmail.com).</p>
          )}

          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Salesperson">Personal Acount</option>
          </select>

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
        <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span
          onClick={togglePasswordVisibility}
          className="password-toggle"
          role="button"
          tabIndex={0}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </span>
        </div>
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
        <div className="password-container">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <span
          onClick={toggleConfirmPasswordVisibility}
          className="password-toggle"
          role="button"
          tabIndex={0}
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </span>
        </div>
        {formData.password && formData.password !== formData.confirmPassword && (
          <p style={{ color: 'red', fontSize: 'smaller' }}>The passwords don't match!</p>
        )}

          <div className="terms-container">
            <p>
              By clicking "<strong>Register,</strong>" you agree to our{' '}
              <a href="/documents/TERMS OF SERVICE.pdf" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/documents/Privacy Policy.pdf" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </p>
          </div>


          <button type="button" onClick={previousStep}>Back</button>
          <button type="submit">
          {loading ? "Registering..." : "Register"}
          </button>
      </div>

      )}


      </form>
      <div className="divmess">
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Register;

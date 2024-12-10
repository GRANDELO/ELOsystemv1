import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/styles.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/reset-password', formData);
      setMessage(response.data.message);
      
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
          const emailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email);
          return emailValid;
        case 2:
          return formData.verificationCode.length > 0;
        case 3:
          const passwordValid = formData.newPassword.length >= 8 &&
            /[A-Z]/.test(formData.newPassword) &&
            /[a-z]/.test(formData.newPassword) &&
            /[0-9]/.test(formData.newPassword) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
          return passwordValid && formData.newPassword === formData.confirmNewPassword;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep]);
  
  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div className="formsep">
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
          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="formsep">
          <label>Verification Code:</label>
          <input
            type="text"
            name="verificationCode"
            placeholder="Enter your verification code"
            value={formData.verificationCode}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={previousStep}>Back</button>
          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 3 && (
        <div className="formsep">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {formData.newPassword && formData.newPassword.length < 8 && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must be at least 8 characters long.</p>
          )}
          {formData.newPassword && !/[A-Z]/.test(formData.newPassword) && (
            <p style={{ color: 'red' }}>Password must contain at least one uppercase letter.</p>
          )}
          {formData.newPassword && !/[a-z]/.test(formData.newPassword) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one lowercase letter.</p>
          )}
          {formData.newPassword && !/[0-9]/.test(formData.newPassword) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one number.</p>
          )}
          {formData.newPassword && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one special character.</p>
          )}

          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm your new password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
          {formData.newPassword && formData.newPassword !== formData.confirmNewPassword && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>The passwords don't match!</p>
          )}

          <button type="button" onClick={previousStep}>Back</button>
          <button type="submit" disabled={!isNextEnabled}>Reset Password</button>
        </div>
      )}
      </form>
      <div className="divmess">
          {message && <p className="message">{message}</p>}
      </div>

      <p>If you remember your password <Link to="/">Login</Link></p>
    </div>
  );
};

export default ResetPassword;

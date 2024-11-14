import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/admpasswordreset.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/employees/reset-password', formData);
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
          return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email);
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
    <div className="pasrec-container">
      <h2 className="pasrec-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="pasrec-form">
        {currentStep === 1 && (
          <div className="pasrec-form-section">
            <label className="pasrec-label">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="pasrec-input"
              required
            />
            {formData.email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email) && (
              <p className="pasrec-error">Please enter a valid Gmail address (e.g., yourname@gmail.com).</p>
            )}
            <button type="button" onClick={nextStep} disabled={!isNextEnabled} className="pasrec-button">Next</button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="pasrec-form-section">
            <label className="pasrec-label">Verification Code:</label>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter your verification code"
              value={formData.verificationCode}
              onChange={handleChange}
              className="pasrec-input"
              required
            />
            <button type="button" onClick={previousStep} className="pasrec-button">Back</button>
            <button type="button" onClick={nextStep} disabled={!isNextEnabled} className="pasrec-button">Next</button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="pasrec-form-section">
            <label className="pasrec-label">New Password:</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="pasrec-input"
              required
            />
            {formData.newPassword && formData.newPassword.length < 8 && (
              <p className="pasrec-error">Password must be at least 8 characters long.</p>
            )}
            {formData.newPassword && !/[A-Z]/.test(formData.newPassword) && (
              <p className="pasrec-error">Password must contain at least one uppercase letter.</p>
            )}
            {formData.newPassword && !/[a-z]/.test(formData.newPassword) && (
              <p className="pasrec-error">Password must contain at least one lowercase letter.</p>
            )}
            {formData.newPassword && !/[0-9]/.test(formData.newPassword) && (
              <p className="pasrec-error">Password must contain at least one number.</p>
            )}
            {formData.newPassword && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) && (
              <p className="pasrec-error">Password must contain at least one special character.</p>
            )}

            <label className="pasrec-label">Confirm New Password:</label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm your new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="pasrec-input"
              required
            />
            {formData.newPassword && formData.newPassword !== formData.confirmNewPassword && (
              <p className="pasrec-error">The passwords don't match!</p>
            )}

            <button type="button" onClick={previousStep} className="pasrec-button">Back</button>
            <button type="submit" disabled={!isNextEnabled} className="pasrec-button">Reset Password</button>
          </div>
        )}
      </form>
      <div className="pasrec-message-container">
        {message && <p className="pasrec-message">{message}</p>}
      </div>

      <p className="pasrec-login-link">If you remember your password <Link to="/">Login</Link></p>
    </div>
  );
};

export default ResetPassword;

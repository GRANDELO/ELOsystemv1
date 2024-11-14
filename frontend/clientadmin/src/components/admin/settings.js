import axios from 'axios';
import React, { useState } from 'react';
import { FaLock, FaPowerOff } from 'react-icons/fa'; // Import icons from Font Awesome
import { useNavigate } from 'react-router-dom';
import './styles/settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const firstName = sessionStorage.getItem('firstName');
  const role = sessionStorage.getItem('role');
  const workID = sessionStorage.getItem('eid');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSavePassword = async () => {
    setError('');
    setMessage('');
    
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match!');
      return;
    }
    
    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/employees/changepassword', { workID, newPassword });
      setMessage(response.data.message);  // Display the success message from the backend
      setError('');
      sessionStorage.setItem('admintoken', response.data.token);
      localStorage.setItem('admintoken', response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while processing your request.');
      setMessage('');  // Clear any success message if an error occurs
    }
  };

  const handleLogout = () => {
    navigate('/admnLogout');
  };

  return (
    <div className="sept-settings-container">
      <header className="sept-header">
        <h2 className="sept-header-title">Welcome, {firstName}!</h2>
        <p className="sept-header-subtitle">{role}</p>
      </header>

      <div className="sept-userinfo">
        <div className="sept-info-box">
          <p><b>Work ID:</b> <i>{workID}</i></p>
        </div>
      </div>

      {/* Button to toggle password change form */}
      <button className="sept-toggle-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
        <FaLock size={20} />
      </button>

      {showPasswordForm && (
        <div className="sept-settings-section">
          <div className="sept-password-fields">
            <label className="sept-label">New Password:</label>
            <input 
              type="password" 
              className="sept-input" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              placeholder="Enter new password" 
            />
        
            <label className="sept-label">Confirm Password:</label>
            <input 
              type="password" 
              className="sept-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm new password" 
            />
        
            <button className="sept-save-btn" type="button" onClick={handleSavePassword}>
             change password
            </button>
          </div>

          {/* Display success or error messages */}
          {message && <p className="sept-success-message">{message}</p>}
          {error && <p className="sept-error-message">{error}</p>}
        </div>
      )}

      {/* Floating Logout button */}
      <button className="sept-logout-btn" onClick={handleLogout}>
        <FaPowerOff size={20} />
      </button>
    </div>
  );
};

export default Settings;

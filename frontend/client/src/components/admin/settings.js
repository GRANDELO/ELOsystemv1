import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/setting.css';

const Settings = () => {
  const navigate = useNavigate();
  const firstName = sessionStorage.getItem('firstName');
  const role = sessionStorage.getItem('role');
  const workID = sessionStorage.getItem('eid');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      sessionStorage.setItem('userToken', response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while processing your request.');
      setMessage('');  // Clear any success message if an error occurs
    }
  };

  const handleLogout = () => {
    navigate('/admnLogout');
  };

  return (
    <div className="settingmain">
      <div className="userinfo">
        <span className="userinfospan">
          <p><b>First Name:</b> <i>{firstName}</i></p>
          <p><b>Role:</b> <i>{role}</i></p>
          <p><b>Work ID:</b> <i>{workID}</i></p>
        </span>
      </div>
      
      <h2>Settings</h2>
      
      <div>
        <label>New Password:</label>
        <input type="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        
        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        
        <button type="button" onClick={handleSavePassword}>Save Password</button>
        
        {/* Display success or error messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      
      <button className="logoutbutton" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Settings;

import axiosInstance from './axiosInstance';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PushNotification from '../PushNotification';
import { getUsernameFromToken, getcategoryFromToken, getemailFromToken } from '../utils/auth';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext
import './styles/setting.css';

const Settings = () => {
  const navigate = useNavigate();
  const lusername = getUsernameFromToken();
  const lemail = getemailFromToken();
  const lcategory = getcategoryFromToken();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePhoneNumber, setChangePhoneNumber] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(null); // Initialize amount state

  useEffect(() => {
    // Fetch the amount from sessionStorage only if the user is in the 'seller' category
    const storedAmount = sessionStorage.getItem('amount');
    if (storedAmount) {
      setAmount(storedAmount); // Set amount if it's available
    } else {
      setAmount(null); // Ensure amount is null if it’s not available
    }
  }, []);

  const handleSaveUsername = async () => {
    setError(null);
    setMessage(null);
    if (!/^[a-zA-Z0-9_]{4,}$/.test(newUsername)) {
      setError('Username must be at least 4 characters long and contain only letters, numbers, or underscores.');
      return;
    } else {
      try {
        const response = await axiosInstance.post('/buyers/changeusername', { lemail, newUsername });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

  const handleSavePassword = async () => {
    setError(null);
    setMessage(null);
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    } else if (newPassword !== confirmPassword) {
      setError('The passwords do not match!');
      return;
    } else {
      try {
        const response = await axiosInstance.post('/buyers/changepassword', { lemail, newPassword });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

  const handleSaveEmail = async () => {
    setError(null);
    setMessage(null);
    if (!/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(newEmail)) {
      setError('Please enter a valid email address (e.g., yourname@gmail.com).');
      return;
    } else {
      try {
        const response = await axiosInstance.post('/buyers/changeemail', { lemail, newEmail });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while updating the email.');
      }
    }
  };

  const handleSavePhoneNumber = async () => {
    setError(null);
    setMessage(null);
    if (!/^(07|01)\d{8}$/.test(newPhoneNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 07 or 01.');
      return;
    } else {
      try {
        const response = await axiosInstance.post('/buyers/changephonenumber', { lemail, newPhoneNumber });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="settingmain">
    <div className="userinfo-card">
      <span className="userinfo-content">
        <p className="userinfo-row">
          <b>Username:</b> <i>{lusername}</i>
        </p>
        <p className="userinfo-row">
          <b>Email:</b> <i>{lemail}</i>
        </p>
        <p className="userinfo-row">
          <b>Category:</b> <i>{lcategory}</i>
        </p>
        {amount !== null && amount !== 'undefined' && (
          <p className="userinfo-row">
            <b>Amount:</b> KES: <i>{amount}</i>
          </p>
        )}
      </span>
    </div>
      <h2>Settings</h2>
      <div className="set-buttons">
        <button className="settings-button" onClick={() => setChangeUsername(!changeUsername)}>Change Username</button>
        <button className="settings-button" onClick={() => setChangePassword(!changePassword)}>Change Password</button>
        <button className="settings-button" onClick={() => setChangeEmail(!changeEmail)}>Change Email</button>
        <button className="settings-button" onClick={() => setChangePhoneNumber(!changePhoneNumber)}>Change Phone Number</button>
        <button className="settings-button" onClick={toggleTheme}>
          Toggle to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      <form>
        {changeUsername && (
          <div>
            <label>New Username:</label>
            <input type="text" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
            <button type="button" onClick={handleSaveUsername}>Save Username</button>
          </div>
        )}
        {changePassword && (
          <div>
            <label>New Password:</label>
            <input type="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="button" onClick={handleSavePassword}>Save Password</button>
          </div>
        )}
        {changeEmail && (
          <div>
            <label>New Email:</label>
            <input type="email" name="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            <button type="button" onClick={handleSaveEmail}>Save Email</button>
          </div>
        )}
        {changePhoneNumber && (
          <div>
            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" placeholder="07XXXXXXXX or 01XXXXXXXX" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} required />
            <button type="button" onClick={handleSavePhoneNumber}>Save Phone Number</button>
          </div>
        )}
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
      <PushNotification/>
      <button className="logoutbutton" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Settings;

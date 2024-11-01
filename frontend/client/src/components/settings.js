import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken, getemailFromToken } from '../utils/auth';
import './styles/setting.css';

const Settings = () => {
  const navigate = useNavigate();
  const lusername = getUsernameFromToken();
  const lemail = getemailFromToken();
  const lcategory = getcategoryFromToken();

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
        const response = await axios.post('https://elosystemv1.onrender.com/api/auth/changeusername', { lemail, newUsername });
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
      <div className="userinfo">
        <span className='userinfospan'>
          <p><b>Username:</b> <i>{lusername}</i></p>
          <p><b>Email:</b> <i>{lemail}</i></p>
          <p><b>Specialty:</b> <i>{lcategory}</i></p>
          {/* Conditionally render amount only if it's defined */}
          {amount && <p><b>Amount:</b> <i>{amount}</i></p>}
        </span>
      </div>
      <h2>Settings</h2>
      <div className="set-buttons">
        <button className="settings-button" onClick={() => setChangeUsername(!changeUsername)}>Change Username</button>
        <button className="settings-button" onClick={() => setChangePassword(!changePassword)}>Change Password</button>
        <button className="settings-button" onClick={() => setChangeEmail(!changeEmail)}>Change Email</button>
        <button className="settings-button" onClick={() => setChangePhoneNumber(!changePhoneNumber)}>Change Phone Number</button>
      </div>
      <form>
        {/* Form sections omitted for brevity */}
      </form>
      <button className="logoutbutton" onClick={handleLogout}>Logout</button>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Settings;

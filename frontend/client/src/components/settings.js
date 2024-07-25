import axios from 'axios';
import React, { useState } from 'react';
import { getUsernameFromToken, getcategoryFromToken, getemailFromToken } from '../utils/auth';
import Prof from './images/prof.jpeg';
import './styles/setting.css';

const Settings = () => {
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

    const handleSaveUsername = async () => {
        if (!/^[a-zA-Z0-9_]{4,}$/.test(newUsername)) {
            setError('Username must be at least 4 characters long and contain only letters, numbers, or underscores.');
            return;
        }else
        {
          try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/auth/changeusername', {lemail, newUsername });
            setMessage(response.data.message);
          } catch (error) {
            if (error.response && error.response.data) {
              setMessage(error.response.data.message);
            } else {
              setMessage('An error occurred while processing your request..');
            }
          }
        }
        // Perform the save operation and handle success/failure
    };

    const handleSavePassword = async () => {
        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setError('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }else if (newPassword !== confirmPassword) {
            setError('The passwords do not match!');
            return;
        }else
        {
          try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/auth/changepassword', {lemail, newPassword });
            setMessage(response.data.message);
          } catch (error) {
            if (error.response && error.response.data) {
              setMessage(error.response.data.message);
            } else {
              setMessage('An error occurred while processing your request..');
            }
          }
        }
    };

    const handleSaveEmail = async () => {
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(newEmail)) {
            setError('Please enter a valid gmail address (e.g., yourname@gmail.com).');
            return;
        }else{
          try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/auth/update-email', { oldEmail: lemail, newEmail });
            if (response.status === 200) {
              setError(null);
            }
          } catch (error) {
            if (error.response && error.response.data) {
              setError(error.response.data.message);
            } else {
              setError('An error occurred while updating the email.');
            }
          }
        }
    };

    const handleSavePhoneNumber = async () => {
        if (!/^(07|01)\d{8}$/.test(newPhoneNumber)) {
            setError('Please enter a valid 10-digit phone number starting with 07 or 01.');
            return;
        }else{

          try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/auth/changephonenumber', {lemail, newPhoneNumber });
            setMessage(response.data.message);
          } catch (error) {
            if (error.response && error.response.data) {
              setMessage(error.response.data.message);
            } else {
              setMessage('An error occurred while processing your request..');
            }
          }
        }
    };

    return (
        <div className="container">
            <div className="userinfo">
              <img width="70px" src={Prof} alt="User Avatar"/>
              <p><b>Username:</b> <i>{lusername}</i></p>
              <p><b>Email:</b> <i>{lemail}</i></p>
              <p><b>Specialty:</b> <i>{lcategory}</i></p>
            </div>
            <h2>Settings</h2>
            <div>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Specialty:</strong> {specialty}</p>
                <button className="settings-button" onClick={() => setChangeUsername(!changeUsername)}>Change Username</button>
                <button className="settings-button" onClick={() => setChangePassword(!changePassword)}>Change Password</button>
                <button className="settings-button" onClick={() => setChangeEmail(!changeEmail)}>Change Email</button>
                <button className="settings-button" onClick={() => setChangePhoneNumber(!changePhoneNumber)}>Change Phone Number</button>
            </div>
            <form>
                {changeUsername && (
                    <div>
                        <label>New Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                        {newUsername && !/^[a-zA-Z0-9_]{4,}$/.test(newUsername) && (
                            <p>Username must be at least 4 characters long and contain only letters, numbers, or underscores.</p>
                        )}
                        <button type="button" onClick={handleSaveUsername}>Save Username</button>
                    </div>
                )}
                {changePassword && (
                    <div>
                        <label>New Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {newPassword && newPassword.length < 8 && (
                            <p>Password must be at least 8 characters long.</p>
                        )}
                        {newPassword && !/[A-Z]/.test(newPassword) && (
                            <p>Password must contain at least one uppercase letter.</p>
                        )}
                        {newPassword && !/[a-z]/.test(newPassword) && (
                            <p>Password must contain at least one lowercase letter.</p>
                        )}
                        {newPassword && !/[0-9]/.test(newPassword) && (
                            <p>Password must contain at least one number.</p>
                        )}
                        {newPassword && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) && (
                            <p>Password must contain at least one special character.</p>
                        )}
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {newPassword && newPassword !== confirmPassword && (
                            <p>The passwords do not match!</p>
                        )}
                        <button type="button" onClick={handleSavePassword}>Save Password</button>
                    </div>
                )}
                {changeEmail && (
                    <div>
                        <label>New Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                        {newEmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(newEmail) && (
                            <p>Please enter a valid gmail address (e.g., yourname@gmail.com).</p>
                        )}
                        <button type="button" onClick={handleSaveEmail}>Save Email</button>
                    </div>
                )}
                {changePhoneNumber && (
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="07XXXXXXXX or 01XXXXXXXX"
                            pattern="(07|01)\d{8}"
                            title="Please enter a valid 10-digit phone number starting with 07 or 01"
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            required
                        />
                        {newPhoneNumber && !/^(07|01)\d{8}$/.test(newPhoneNumber) && (
                            <p>Please enter a valid 10-digit phone number starting with 07 or 01.</p>
                        )}
                        <button type="button" onClick={handleSavePhoneNumber}>Save Phone Number</button>
                    </div>
                )}
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Settings;

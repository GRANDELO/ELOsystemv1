import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ThankYou.css';

function Verification() {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const [emailPresent, setEmailPresent] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      setEmailPresent(true);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const emailToUse = email || newEmail;
      const response = await axiosInstance.post('/delivery/verify', { email: emailToUse, verificationCode });
      if (response.status === 200) {
        navigate('/success');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  };

  const handleEditEmail = () => {
    setEditingEmail(true);
    setEmailPresent(true);
  };

  const handleEditEmail2 = () => {
    setEditingEmail(true);
    setEmailPresent(false);
  };
  
  // When you want to update the email

  const handleSaveEmail = async () => {
    if(!(/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(newEmail)))
      {
        setError('Please enter a valid email address (e.g., yourname@gmail.com).');
      }
    else
    {
      try {

        if (newUsername !== "") {
          setEmail(newUsername);
        }
        
        const response = await axiosInstance.post('/delivery/update-email', { oldEmail: email, newEmail });
        if (response.status === 200) {
          setEmail(newEmail);
          sessionStorage.setItem('email', newEmail);
          setEditingEmail(false);
          setEmailPresent(true);
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

  const handleresendEmail = async () => {
    try {
      const emailToUse = email || newEmail;
      if (!emailToUse) {
        setError('Enter your email.');
      } else {
        const response = await axiosInstance.post('/delivery/resendemail', { email: emailToUse });
        if (response.status === 200) {
          setError('Verification code has been resent.');
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while resending the verification code. Try again later.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Verify Your Account</h2>
      <h4>Check your email to get the verification code.</h4>
      <h4>If you didn't get the email check the spam folder first before requesting for a resend.</h4>
      <form onSubmit={handleVerify}>

        {emailPresent && !editingEmail ? (
          
          <div>
            <label>Email:</label>
            <p>{email}</p>
            <button type="button" onClick={handleEditEmail}>Change Email</button>
          </div>
        ) : editingEmail ? (
          <div>
            {!emailPresent ?(
              <>
                <label>Current Username:</label>
                <input type="text" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
              
                <label>New Email:</label>
                <input
                  type="email"
                  value={newEmail}
                  pattern="/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/"
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </>
            ):(
              <>
                  <label>New Email:</label>
                  <input
                    type="email"
                    value={newEmail}
                    pattern="/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/"
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
              </>
            )}


            <button type="button" onClick={handleSaveEmail}>Save Email</button>
          </div>
        ) : (
          <div>
          <label>Email:</label>
          <input
            type="email"
            value={newEmail}
            pattern="/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/"
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          
        </div>
        ) }
        <div>

          <label>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify</button>
      </form>
      <button type="button" onClick={handleresendEmail}>Resend verification code</button>
      <button type="button" onClick={handleEditEmail2}>Change Email</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Verification;

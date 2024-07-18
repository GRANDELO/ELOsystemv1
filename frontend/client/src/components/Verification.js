import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

function Verification() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('No email found for verification. Please register first.');
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/verify', { email, verificationCode });
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

  return (
    <div className="container">
      <h2>Verify Your Account</h2>
      <form onSubmit={handleVerify}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            readOnly
            required
          />
        </div>
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
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Verification;

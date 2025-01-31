import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/ThankYou.css';

function Verification() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailToUseFromQuery = queryParams.get('email');
  const verificationCode = queryParams.get('code'); // Updated to fetch 'code'

  useEffect(() => {
    const verifyAccount = async () => {
      setError('');
      setMessage('');
      try {
        setLoading(true);

        // Use query parameter email or fallback to state emails
        const emailToUse = emailToUseFromQuery;
        const response = await axiosInstance.post('/delivery/verify', { email: emailToUse, verificationCode });

        if (response.status === 200) {
          setLoading(false);
          navigate('/success');
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError('Verification failed. Please try again.');
        }
      }
    };

    verifyAccount(); // Call the async function
  }, [emailToUseFromQuery, verificationCode, navigate]);

  return (
    <div className="container">
      <h2>Verify Your Account</h2>
      {loading && <p>Verifying...</p>}
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Verification;

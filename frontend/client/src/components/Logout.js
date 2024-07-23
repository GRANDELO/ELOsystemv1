import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // Add some styling if needed

const Logout = () => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);
        const username = decodedToken?.username;

        if (!token || !username) {
          console.error('Token or username is missing.');
          setLogoutMessage('Error: Token or username is missing.');
          return;
        }

        const response = await axios.post('https://elosystemv1.onrender.com/api/auth/logout', { username }, {

        });

        // Clear the user token or session
        localStorage.removeItem('userToken'); // or your token key

        // Set the message from the backend
        setLogoutMessage(response.data.message);

        // Redirect to login page after a delay to show the message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Error logging out:', error);
        setLogoutMessage('Error logging out. Please try again.');
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h1>Logging Out...</h1>
      <p>{logoutMessage || 'You have been logged out successfully. You will be redirected to the login page shortly.'}</p>
    </div>
  );
};

export default Logout;

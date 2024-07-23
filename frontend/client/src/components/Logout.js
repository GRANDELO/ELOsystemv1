import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // Add some styling if needed

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);
        const username = decodedToken?.username;

        if (!token || !username) {
          console.error('Token or username is missing.');
          return;
        }

        await axios.post('https://elosystemv1.onrender.com/api/auth/logout', { username }, {
        });

        // Clear the user token or session
        localStorage.removeItem('userToken'); // or your token key

        // Redirect to login page or perform other logout actions
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h1>Logging Out...</h1>
      <p>You have been logged out successfully. You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default Logout;

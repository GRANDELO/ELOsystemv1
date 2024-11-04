import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from './images/loader2.gif';
import './styles/Logout.css';
const Logout = () => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = sessionStorage.getItem('userToken');
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
        sessionStorage.removeItem('userToken'); // or your token key
        localStorage.removeItem('token');

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
    <img className="loader"src={loader}/><p>{logoutMessage}</p> 
    </div>
  );
};

export default Logout;

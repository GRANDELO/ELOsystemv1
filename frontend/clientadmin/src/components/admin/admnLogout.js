import axiosInstance from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from '../images/loader2.gif';
import './styles/logout.css';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = sessionStorage.getItem('admintoken');
        const decodedToken = jwtDecode(token);
        const username = decodedToken?.username;

        if (!token || !username) {
          console.error('Token or username is missing.');
          setLogoutMessage('Error: Token or username is missing.');
          return;
        }

        const response = await axiosInstance.post('/employees/logout', { username });

        // Clear the user token or session
        sessionStorage.removeItem('admintoken'); // or your token key
        Cookies.remove('admintoken');
        Cookies.remove('firstName'); 
        Cookies.remove('role');
        Cookies.remove('eid');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('eid');
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
    <div className="set-logout-container">
      <img className="set-loader" src={loader} alt="Loading..." />
      <p className="set-logout-message">{logoutMessage}</p>
    </div>
  );
};

export default Logout;

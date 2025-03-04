import axiosInstance from './axiosInstance';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from './images/loader2.gif';
import './styles/Logout.css';
import Cookies from 'js-cookie';

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

        const response = await axiosInstance.post('/delivery/logout', { username }, {

        });

        // Clear the user token or session
        sessionStorage.removeItem('userToken'); // or your token key
        sessionStorage.removeItem('amount'); 

        Cookies.remove('token');
        Cookies.remove('apptoken');
        Cookies.remove('appcat');
        
        localStorage.removeItem('token');
        localStorage.removeItem('apptoken');
        localStorage.removeItem('appcat');
        

        // Set the message from the backend
        setLogoutMessage(response.data.message);

        // Redirect to login page after a delay to show the message
        navigate('/');
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

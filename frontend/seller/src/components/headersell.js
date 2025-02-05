import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken } from '../utils/auth';
import './styles/headersell.css'; // Import the CSS file for styles

const Header = () => {
  const username = getUsernameFromToken();
  
  // Default Images
  const defaultLogo = 'https://storage.googleapis.com/grandelo.appspot.com/1738611936978-Free Crochet Patterns for a Farmhouse Kitchen.jpeg';
  const defaultBackground = 'https://storage.googleapis.com/grandelo.appspot.com/1738612439977-Download Abstract modern blue stripes or rectangle layer overlapping with shadow on dark blue background for free.jpeg';

  const [logoUrl, setLogoUrl] = useState(defaultLogo);
  const [backgroundUrl, setBackgroundUrl] = useState(defaultBackground);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await axiosInstance.get(`/auth/get-images/${username}`);
        console.log("Background URL: ", response.data.backgroundUrl);  // Check URL
        
        // If the response contains an empty string, fallback to default images
        setLogoUrl(response.data.logoUrl && response.data.logoUrl.trim() !== "" ? response.data.logoUrl : defaultLogo);
        setBackgroundUrl(response.data.backgroundUrl && response.data.backgroundUrl.trim() !== "" ? response.data.backgroundUrl : defaultBackground);
      } catch (err) {
        setError('Error fetching user images');
        console.error(err);
      }
    };

    fetchUserImages();
  }, [username]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    if (currentHour < 22) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <header className="header">
      {error && <p className="error">{error}</p>}
      
      {/* Background image */}
      <img src={backgroundUrl} alt="Background" className="background-image" />

      <div className="header-content">
        <img src={logoUrl} alt="Logo" className="logo" />
        <div className="text-container">
          <h1 className="shdr-titles">{`${getGreeting()}`}</h1>
          <h1 className="shdr-titles">{`Welcome back, ${username}!`}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

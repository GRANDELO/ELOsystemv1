import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken, getcategoryFromToken } from '../utils/auth';

const Header = () => {
  const username = getUsernameFromToken();
  const [logoUrl, setLogoUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the user's images (logo and background)
    const fetchUserImages = async () => {
      try {
        const response = await axiosInstance.get(`/users/get-images/${username}`);
        setLogoUrl(response.data.logoUrl);
        setBackgroundUrl(response.data.backgroundUrl);
      } catch (err) {
        setError('Error fetching user images');
        console.error(err);
      }
    };

    fetchUserImages();
  }, [username]);

  return (
    <header style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', padding: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ textAlign: 'center', color: 'white' }}>
        {logoUrl && <img src={logoUrl} alt="Logo" style={{ maxWidth: '200px', borderRadius: '50%' }} />}
        <h1>Welcome to Bazelink</h1>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { getUsernameFromToken } from '../utils/auth';
import './styles/header.css';

const Header = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchedUsername = getUsernameFromToken();
    setUsername(fetchedUsername || false);
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    if (currentHour < 22) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <header className="hdr-modern-container">
      <div className="hdr-modern-content">
        <h1 className="hdr-modern-title">
          {`${getGreeting()}${username ? `, ${username}` : ''}`}
        </h1>
        <p className="hdr-modern-subtitle">
          Welcome to <span className="hdr-modern-highlight">Bazelink</span>
        </p>
      </div>
    </header>
  );
};

export default Header;

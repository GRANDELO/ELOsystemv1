import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import BGvideo from './images/topvid.mp4';
import './styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const username = getUsernameFromToken();

  // Function to determine the greeting based on the current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else if (currentHour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  return (
    <div className="hdr-container">
      <header className="hdr-header">
        <video className="hdr-bg-video" src={BGvideo} autoPlay loop muted />
        <div className="hdr-content">
          <h1 className="hdr-title">{`${getGreeting()}, ${username}!`}</h1> {/* Updated greeting */}
          <p className="hdr-subtitle">Welcome to Bazelink, your go-to platform to buy anything</p> {/* Updated branding */}
        </div>
      </header>
    </div>
  );
};

export default Header;

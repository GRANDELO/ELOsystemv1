import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import BGvideo from './images/topvid.mp4';
import './styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const username = getUsernameFromToken();

  return (
    <div className="hdr-container">
      <header className="hdr-header">
        <video className="hdr-bg-video" src={BGvideo} autoPlay loop muted />
        <div className="hdr-content">
          <h1 className="hdr-title">Welcome to Grandelo, {username}</h1>
          <p className="hdr-subtitle">Your go-to platform to buy anything</p>
        </div>
      </header>
    </div>
  );
};

export default Header;

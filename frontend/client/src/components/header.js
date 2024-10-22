import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import BGvideo from './images/topvid.mp4';
import './styles/header.css';
const Header = () => {
    const navigate = useNavigate();
    const username = getUsernameFromToken();

    return (
        <div>
          <header className="video-background">
            <video autoPlay muted loop id="myVideo">
              <source src={BGvideo} type="video/mp4" />
            </video>
            <div className="video-overlay">
                <h1>Welcome to Grandelo, {username}</h1>
                <p>Your go-to platform to buy anything</p>
            </div>
          </header>
        </div>
      );
};

export default Header;

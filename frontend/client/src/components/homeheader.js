import React from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/header.css';

const SettingsHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="hdr-header">
      <div className="hdr-logo">
        <FaCog className="hdr-icon" />
        <h1>Settings</h1>
      </div>
      <nav className="hdr-nav">
        <button className="hdr-logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </header>
  );
};

export default SettingsHeader;

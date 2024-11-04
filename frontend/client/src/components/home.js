import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import NewProductForm from './NewProductForm';
import Header from './header';
import Notifications from './notification'; // Import Notifications component
import Productowner from './productowner';
import Productperfomance from './productperfomance';
import Settings from './settings';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('product-list');
  const [loading, setLoading] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Placeholder for unread notifications
  const username = getUsernameFromToken();

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection('');
    } else {
      setActiveSection(section);
    }
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
    setIsNotificationsVisible(false); // Hide notifications when settings is toggled
  };

  const toggleNotifications = () => {
    setIsNotificationsVisible(!isNotificationsVisible);
    setIsSettingsVisible(false); // Hide settings when notifications is toggled
    setUnreadNotifications(0); // Reset unread count on open
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get(`https://elosystemv1.onrender.com/api/notifications/${username}`);
      const unreadNotifications = response.data.filter(notification => !notification.isRead);
      setUnreadNotifications(unreadNotifications.length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };
  
  if (username) {
    fetchUnreadNotifications();
  }


  useEffect(() => {
    if (activeSection === 'product-list') {
      setLoading(true);
      const fetchProducts = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      };
      fetchProducts();
    }
  }, [activeSection]);

  return (
    <div className="home">
      <Header />
      <main className="home-main">
        {/* Settings Section */}
        {isSettingsVisible && (
          <section className="home-settings-section">
            <Settings />
          </section>
        )}

        {/* Notifications Section */}
        {isNotificationsVisible && (
          <section className="home-notifications-section">
            <Notifications />
          </section>
        )}

        {/* Introduction Section */}
        <section className="home-intro">
          <p>
            <strong>This is the seller home page</strong>
          </p>

          <div className="home-toggle-buttons">
            <button
              className={`home-settings-button ${activeSection === 'product-list' ? 'active' : ''}`}
              onClick={() => toggleSection('product-list')}
            >
              Show My Products
            </button>
            <button
              className={`home-settings-button ${activeSection === 'add-product' ? 'active' : ''}`}
              onClick={() => toggleSection('add-product')}
            >
              Add New Product
            </button>
            <button
              className={`home-settings-button ${activeSection === 'product-performance' ? 'active' : ''}`}
              onClick={() => toggleSection('product-performance')}
            >
              View Performance
            </button>
          </div>

          <div className="home-show-section">
            {loading ? (
              <div className="home-loading-container">
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                {activeSection === 'product-list' && (
                  <div className="home-product-container">
                    <Productowner />
                  </div>
                )}
                {activeSection === 'add-product' && (
                  <div className="home-product-form-container">
                    <NewProductForm />
                  </div>
                )}
                {activeSection === 'product-performance' && (
                  <div className="home-product-performance-container">
                    <Productperfomance />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="salesp-floating-buttons">
        <button className="salesp-toggle-button" onClick={toggleSettings}>
          <FaCog />
        </button>
        <button className="salesp-toggle-button" onClick={toggleNotifications}>
          <FaBell />
          {unreadNotifications > 0 && (
            <span className="salesp-notification-count">{unreadNotifications}</span>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>Contact us: grandeloltd1@gmail.com</p>
        <p>&copy; 2024 Grandelo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

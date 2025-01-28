import React, { useEffect, useState, useCallback } from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import Header from './headersell';
import Notifications from './notification';
import NewProductForm from './NewProductForm';
import ProductOwner from './productowner';
import ProductPerformance from './productperfomance';
import Settings from './settings';
import ShopSettings from './shopSettings';
import Displayorder from './displayorder';
import Footer from './Footer';
import FeedbackForm from './Feedback';
import Withdrawal from './withdrawal';
import { getUsernameFromToken } from '../utils/auth';
import './styles/Home.css';
import { BsBoxFill } from "react-icons/bs";

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('product-list');
  const [loading, setLoading] = useState(false);
  const [setnavop, setsetnavop] = useState(false);
  const [uiState, setUiState] = useState({
    settings: false,
    notifications: false,
    shopSettings: false,
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const username = getUsernameFromToken();

  // Toggle visibility for sections
  const toggleVisibility = (section) => {
    setUiState((prev) => {
      const newState = {
        settings: section === 'settings' ? !prev.settings : false,
        notifications: section === 'notifications' ? !prev.notifications : false,
        shopSettings: section === 'shopSettings' ? !prev.shopSettings : false,
      };
  
      // Determine if all sections are hidden
      const isAnySectionVisible = newState.settings || newState.notifications || newState.shopSettings;
      
      // Update the state of setnavop based on visibility
      setsetnavop(isAnySectionVisible);
  
      // Reset unread notifications if notifications section is toggled on
      if (section === 'notifications' && newState.notifications) {
        setUnreadNotifications(0); // Reset unread count
      }
  
      return newState;
    });
  };
  

  // Close all floating sections
  const closeAllFloatingSections = () => {
    setUiState({
      settings: false,
      notifications: false,
      shopSettings: false,
    });
  };

  // Fetch unread notifications
  const fetchUnreadNotifications = useCallback(async () => {
    if (username) {
      try {
        const { data } = await axiosInstance.get(`/notifications/${username}`);
        const unreadCount = data.filter((notification) => !notification.isRead).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }
  }, [username]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  // Fetch products on activeSection change
  useEffect(() => {
    if (activeSection === 'product-list') {
      setLoading(true);
      const loadProducts = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      };
      loadProducts();
    }
  }, [activeSection]);

  // Handle back button press
  useEffect(() => {
    const handlePopState = () => {
      if (uiState.settings || uiState.notifications || uiState.shopSettings) {
        closeAllFloatingSections();
        return;
      }
      navigate(-1); // If no floating sections are open, navigate back
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [uiState, navigate]);

  return (
    <div className="home">
      <Header />

      <main className="home-main">
        {/* Main Content */}
        
        {!setnavop ? (
          <section className="home-intro">
          <div className="home-toggle-buttons">
            <button
              className={`home-settings-button ${activeSection === 'product-list' ? 'active' : ''}`}
              onClick={() => setActiveSection('product-list')}
            >
              Show My Products
            </button>
            <button
              className={`home-settings-button ${activeSection === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveSection('add-product')}
            >
              Add New Product
            </button>
            <button
              className={`home-settings-button ${activeSection === 'product-performance' ? 'active' : ''}`}
              onClick={() => setActiveSection('product-performance')}
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
                {activeSection === 'product-list' && <ProductOwner />}
                {activeSection === 'add-product' && <NewProductForm />}
                {activeSection === 'product-performance' && <ProductPerformance />}
              </>
            )}
          </div>
        </section>

        ) : (

        <div>
          <section className={`home-settings-section ${uiState.settings ? 'active' : ''}`}>
            <div>
            <Withdrawal />
            </div>
            
            <div>
            <Settings />
            </div>
            
            <div>
            <ShopSettings />
            </div>
            
          </section>

          {/* Notifications Section */}
          <section className={`home-notifications-section ${uiState.notifications ? 'active' : ''}`}>
            <Notifications />
          </section>

          {/* Shop Settings Section */}
          <section className={`home-shop-settings-section ${uiState.shopSettings ? 'active' : ''}`}>
            <Displayorder />
          </section>
        </div>
        )

        }
        
      </main>

      {/* Floating Action Buttons (Mobile Only) */}
      <div className="salesp-floating-buttons">
        <button className="salesp-toggle-button" onClick={() => toggleVisibility('settings')}>
          <FaCog />
        </button>

        <button className="salesp-toggle-button" onClick={() => toggleVisibility('notifications')}>
        <FaBell />
          {unreadNotifications > 0 && (
            <span className="salesp-notification-count">{unreadNotifications}</span>
          )}
         
        </button>
        
        <button className="salesp-toggle-button" onClick={() => toggleVisibility('shopSettings')}>
          <BsBoxFill />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Home;

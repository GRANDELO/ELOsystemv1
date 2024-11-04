import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBell, FaBoxOpen, FaCog, FaShoppingCart } from 'react-icons/fa'; // Import bell icon for notifications
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import Cart from './Cart';
import Footer from './Footer';
import NewProductList from './NewProductList';
import Displayorder from './displayorder';
import Header from './header';
import Notifications from './notification'; // Import Notifications component
import Settings from './settings';
import './styles/salespersonhome.css';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications
  const username = getUsernameFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
        setCart(response.data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/notifications/${username}`);
        const unreadNotifications = response.data.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    };

    if (username) {
      fetchCart();
      fetchUnreadNotifications();
    }
  }, [username]);

  const handleLogout = () => {
    navigate('/logout');
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
    setIsSettingsVisible(false);
    setIsOrderVisible(false);
    setIsNotificationsVisible(false);
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
    setIsCartVisible(false);
    setIsOrderVisible(false);
    setIsNotificationsVisible(false);
  };

  const toggleOrder = () => {
    setIsOrderVisible(!isOrderVisible);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsNotificationsVisible(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsVisible(!isNotificationsVisible);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsOrderVisible(false);
  };

  return (
    <div className="salesp-home">
      <Header />

      <main className="salesp-main">
        <div className="salesp-home-intro">
          <NewProductList />
        </div>
        
        {/* Settings Section */}
        {isSettingsVisible && (
          <section className="salesp-settings-section">
            <Settings />
            <button className="salesp-toggle-settings" onClick={toggleSettings}>
              <IoClose />
            </button>
          </section>
        )}

        {/* Display Order Section */}
        {isOrderVisible && (
          <section className="salesp-order-section">
            <Displayorder />
            <button className="salesp-toggle-order" onClick={toggleOrder}>
              <IoClose />
            </button>
          </section>
        )}

        {/* Notifications Section */}
        {isNotificationsVisible && (
          <section className="salesp-notifications-section">
            <Notifications username={username} onMarkAsRead={() => setUnreadCount((count) => count - 1)} />
            <button className="salesp-toggle-notifications" onClick={toggleNotifications}>
              <IoClose />
            </button>
          </section>
        )}

        {/* Cart Section */}
        {isCartVisible && (
          <div className="salesp-floating-cart show">
            {!loading && !error && cart.length > 0 && <Cart cart={cart} setCart={setCart} />}
          </div>
        )}
      </main>

      {/* Floating Buttons for Toggle */}
      <div className="salesp-floating-buttons">
        <button className="salesp-toggle-button" onClick={toggleCart}>
          <FaShoppingCart />
        </button>
        <button className="salesp-toggle-button" onClick={toggleSettings}>
          <FaCog />
        </button>
        <button className="salesp-toggle-button" onClick={toggleOrder}>
          <FaBoxOpen />
        </button>
        <button className="salesp-toggle-button" onClick={toggleNotifications}>
          <FaBell />
          {unreadCount > 0 && <span className="salesp-notification-count">{unreadCount}</span>}
        </button>
      </div>

      <footer className="salesp-home-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaCog, FaShoppingCart } from 'react-icons/fa'; // Import icons
import { IoClose } from 'react-icons/io5'; // Close icon
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import Cart from './Cart';
import Footer from './Footer';
import NewProductList from './NewProductList';
import Displayorder from './displayorder';
import Header from './header';
import Settings from './settings';
import './styles/salespersonhome.css';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // Initially hidden
  const [isOrderVisible, setIsOrderVisible] = useState(false); // Track visibility of Displayorder
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

    if (username) {
      fetchCart();
    }
  }, [username]);

  const handleLogout = () => {
    navigate('/logout');
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
    if (isSettingsVisible) {
      setIsSettingsVisible(false); // Close cart if order display is open
    }
    if (isOrderVisible) {
      setIsOrderVisible(false); // Close cart if settings are open
    }
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
    if (isCartVisible) {
      setIsCartVisible(false); // Close cart if settings are open
    }
    if (isOrderVisible) {
      setIsOrderVisible(false); // Close cart if settings are open
    }
  };

  const toggleOrder = () => {
    setIsOrderVisible(!isOrderVisible);
    if (isCartVisible) {
      setIsCartVisible(false); // Close cart if order display is open
    }
    if (isSettingsVisible) {
      setIsSettingsVisible(false); // Close cart if order display is open
    }
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
              <IoClose /> {/* Close icon */}
            </button>
          </section>
        )}
        {/* Display Order Section */}
        {isOrderVisible && (
          <section className="salesp-order-section">
            <Displayorder />
            <button className="salesp-toggle-order" onClick={toggleOrder}>
              <IoClose /> {/* Close icon */}
            </button>
          </section>
        )}
        {isCartVisible && (
        <div className="salesp-floating-cart show">
          {!loading && !error && cart.length > 0 && <Cart cart={cart} setCart={setCart} />}
        </div>
      )}
      </main>
      <div className="salesp-floating-buttons">
        <button className="salesp-toggle-button" onClick={toggleCart}>
          <FaShoppingCart />
        </button>
        <button className="salesp-toggle-button" onClick={toggleSettings}>
          <FaCog />
        </button>
        <button className="salesp-toggle-button" onClick={toggleOrder}>
          <FaBoxOpen /> {/* New icon for Displayorder */}
        </button>
      </div>
      <footer className="salesp-home-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;

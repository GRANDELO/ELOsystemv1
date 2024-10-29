import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCog, FaShoppingCart } from 'react-icons/fa'; // Import icons
import { IoClose } from 'react-icons/io5'; // Close icon
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import Cart from './Cart';
import NewProductList from './NewProductList';
import Header from './header';
import Settings from './settings';
import Footer from './Footer';
import './styles/salespersonhome.css';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(true); // Track visibility of settings
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
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
    if(isCartVisible)
      {
        setIsCartVisible(!isCartVisible);
      }
  };

  return (
    <div className="salesp-home">
      <Header />
      <main className="salesp-main">
        <div className="salesp-home-intro">
          <NewProductList />
        </div>
        {isSettingsVisible && (
          <section className={`salesp-settings-section ${isSettingsVisible ? '' : 'closed'}`}>
            <Settings />
            <button className="salesp-toggle-settings" onClick={toggleSettings}>
              <IoClose /> {/* Close icon without background */}
            </button>
          </section>
        )}
      </main>
      <div className="salesp-floating-buttons">
        <button className="salesp-toggle-button" onClick={toggleCart}>
          <FaShoppingCart />
        </button>
        <button className="salesp-toggle-button" onClick={toggleSettings}>
          <FaCog />
        </button>
      </div>
      {isCartVisible && (
        <div className={`salesp-floating-cart ${isCartVisible ? 'show' : ''}`}>
          {!loading && !error && cart.length > 0 && <Cart cart={cart} setCart={setCart} />}
        </div>
      )}
      <footer className="salesp-home-footer">
        < Footer/>
        
      </footer>
    </div>
  );
};

export default Home;

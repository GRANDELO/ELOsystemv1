import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { FaBell, FaBoxOpen, FaCog, FaShoppingCart, FaCommentDots } from 'react-icons/fa'; // Import bell icon for notifications
import { FiArrowDown, FiArrowUp, FiXCircle } from "react-icons/fi";
import { FaMessage } from "react-icons/fa6";
import { AiOutlineQrcode } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken } from '../utils/auth';
import Cart from './Cart';
import AppDownloadQRIcon from './qrCode';
import Footer from './Footer';
import Qrscaner from './qrscaner';
import NewProductList from './NewProductList';
import Displayorder from './displayorder';
import Header from './header';
import Notifications from './notification'; // Import Notifications component
import Settings from './settings';
import FeedbackForm from './Feedback';
import './styles/salespersonhome.css';
import { Alert} from 'react-bootstrap';
import { useIsMobile } from '../utils/mobilecheck';

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
  const [loginPrompt, setLoginPrompt] = useState('');
  const token = localStorage.getItem('token');
  const apptoken = localStorage.getItem('apptoken');
  const appcat = localStorage.getItem('appcat');
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false); 
  const [isQrScannerVisible, setIsQrScannerVisible] = useState(false); // QR Scanner State
  const [qrResult, setQrResult] = useState('');
  const [setnavop, setsetnavop] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // If apptoken is set, use it to set the token and navigate based on the app category
    if (apptoken) {
      localStorage.setItem('token', apptoken);
      if (appcat) {
        switch (appcat.trim().toLowerCase()) {
          case 'seller':
            alert('Failed to log in this app is for buyers only.');
            navigate('/logout');
            break;
          default:
            const currentpage = sessionStorage.getItem('currentpage');
            navigate(currentpage ? currentpage : '/');
            break;
        }
      }
    }

    // If token exists, store user data and determine navigation
    if (token) {
      sessionStorage.setItem('userToken', token);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);
    }
  }, [apptoken, appcat, token, navigate]);


  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/cart/cart', { username });
      setCart(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/notifications/${username}`);
      const unreadNotifications = response.data.filter(notification => !notification.isRead);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };
  const handleLogout = () => {
    navigate('/logout');
  };
  

  // Handle back button press
  useEffect(() => {
    const handlePopState = async () => {
      setIsQrScannerVisible(false);
      setIsOrderVisible(false);
      setIsCartVisible(false);
      setIsFeedbackVisible(false);
      setIsSettingsVisible(false);
      setIsNotificationsVisible(false);// If no floating sections are open, navigate back
      
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [ navigate]);


    const toggleFeedback = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to send feedback.');
      return;
    }
    
    setIsFeedbackVisible(!isFeedbackVisible);
    setIsOrderVisible(false);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsNotificationsVisible(false);
    setIsQrScannerVisible(false);
    setsetnavop(!isFeedbackVisible);
  };
  const toggleCart = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to open the cart.');
      return;
    }
    fetchCart();
    setIsFeedbackVisible(false);
    setIsCartVisible(!isCartVisible);
    setIsSettingsVisible(false);
    setIsOrderVisible(false);
    setIsNotificationsVisible(false);
    setIsQrScannerVisible(false);
    setsetnavop(!isCartVisible);
  };

  const toggleSettings = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to open settings.');
      return;
    }

    setIsFeedbackVisible(false);
    setIsSettingsVisible(!isSettingsVisible);
    setIsCartVisible(false);
    setIsOrderVisible(false);
    setIsNotificationsVisible(false);
    setIsQrScannerVisible(false);
    setsetnavop(!isSettingsVisible);
  };

  const toggleOrder = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to access your order.');
      return;
    }

    setIsFeedbackVisible(false);
    setIsOrderVisible(!isOrderVisible);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsNotificationsVisible(false);
    setIsQrScannerVisible(false);
    setsetnavop(!isOrderVisible);
  };

  const toggleNotifications = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to view your notifications.');
      return;
    }

    setIsFeedbackVisible(false);
    fetchUnreadNotifications();
    setIsNotificationsVisible(!isNotificationsVisible);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsOrderVisible(false);
    setIsQrScannerVisible(false);
    setsetnavop(!isNotificationsVisible);
  };

  const toggleQRScanner = async () => {

    setIsQrScannerVisible(!isQrScannerVisible);
    setIsFeedbackVisible(false);
    fetchUnreadNotifications();
    setIsNotificationsVisible(false);
    setIsCartVisible(false);
    setIsSettingsVisible(false);
    setIsOrderVisible(false);
    setsetnavop(!isQrScannerVisible);
  };
  

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };



  return (
    <div className="salesp-home">
      <Header />
      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}

      {isMobile ? (
              <main className="salesp-main">
                {!setnavop ?
                (
                  <div className="salesp-home-intro">
                      <NewProductList />
                  </div>
                ):
                (
                  <>
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
                      <div className="salesp-order-section">
                        {!loading && !error ? (
                          cart.length > 0 ? (
                            <Cart cart={cart} setCart={setCart} />
                          ) : (
                            <p>Your cart is empty.</p>
                          )
                        ) : null}
                      </div>
            
                    )}
                    {/* Feedback Section */}
                    {isFeedbackVisible && (
                      <section  className="salesp-settings-section">
                        <FeedbackForm />
                        <button onClick={toggleFeedback}>
                          <IoClose />
                        </button>
                      </section>
                    )}
                    {/* QR Scanner Section */}
                    {isQrScannerVisible && (
                      <div className="salesp-settings-section">
                        <h4>Scan QR Code</h4>
                        <Qrscaner/>
                        <p>Scanned Result: {qrResult}</p>
                        <button onClick={toggleQRScanner}>
                          <IoClose /> Close Scanner
                        </button>
                      </div>
                    )}
                  </>
                )}

            </main>
      ):(
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
          <div className="salesp-order-section">
            {!loading && !error ? (
              cart.length > 0 ? (
                <Cart cart={cart} setCart={setCart} />
              ) : (
                <p>Your cart is empty.</p>
              )
            ) : null}
          </div>

        )}
        {/* Feedback Section */}
        {isFeedbackVisible && (
          <section  className="salesp-settings-section">
            <FeedbackForm />
            <button onClick={toggleFeedback}>
              <IoClose />
            </button>
          </section>
        )}
        {/* QR Scanner Section */}
        {isQrScannerVisible && (
          <div className="salesp-settings-section">
            <h4>Scan QR Code</h4>
            <Qrscaner/>
            <p>Scanned Result: {qrResult}</p>
            <button onClick={toggleQRScanner}>
              <IoClose /> Close Scanner
            </button>
          </div>
        )}
      </main>
      )}


      {/* Floating Buttons for Toggle */}
      <div className="salesp-floating-buttons">

        <>
          {isNavVisible ? (
                    <>
                    {isNavVisible ? (''): ('')}
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
                    <button className="salesp-toggle-button" onClick={toggleQRScanner}>
                      <AiOutlineQrcode />
                    </button>
                    <button className="salesp-toggle-button"  onClick={toggleFeedback}>
                      <FaMessage /> {/* Feedback Icon */}
                    </button>
                    <button className="salesp-toggle-button" onClick={toggleNav}>
                      <FiXCircle />
                    </button>
                  </>
          ): ( 
          <button className="salesp-toggle-button" onClick={toggleNav}>
            <IoMdMenu />
          </button>)}
        </>

      </div>

      <footer className="salesp-home-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;

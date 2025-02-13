import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import { FaBell, FaBoxOpen, FaCog, FaShoppingCart, FaCommentDots, FaWhatsapp } from 'react-icons/fa'; // Import bell icon for notifications
import { FiArrowDown, FiArrowUp, FiXCircle } from "react-icons/fi";
import { FaMessage } from "react-icons/fa6";
import { AiOutlineQrcode } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken } from '../utils/auth';
import Cart from './Cart';
import WhatsAppButton from './Whatsapp';
import AppDownloadQRIcon from './qrCode';
import Footer from './Footer';
import Qrscaner from './qrscaner';
import NewProductList from './shopProductList';
import Displayorder from './displayorder';
import Header from './headersell';
import Notifications from './notification'; // Import Notifications component
import Settings from './settings';
import FeedbackForm from './Feedback';
import './styles/salespersonhome.css';
import { Alert} from 'react-bootstrap';
import { useIsMobile } from '../utils/mobilecheck';
import Tour from 'reactour';
const Shop = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const businessname = queryParams.get('businessname');

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
  const [isWhatsappVisible, setIsWhatsappVisible] = useState(false);
  const [isQrScannerVisible, setIsQrScannerVisible] = useState(false); // QR Scanner State
  const [qrResult, setQrResult] = useState('');
  const [setnavop, setsetnavop] = useState(false);
  const isMobile = useIsMobile();
  const initialSteps = isMobile
  ? [
      {
        selector: '.salesp-home-intro',
        content: 'Welcome to our store! Here you can browse our latest products.',
      },
      {
        selector: '.product-card',
        content: 'Browse through our products and find what you need!',
      },
      {
        selector: '.salesp-toggle-button',
        content: 'Click here to open the main navigation menu.',
      },
      {
        selector: '.salesp-toggle-button:first-child',
        content: 'This is your cart. Check your added items here.',
      },
      {
        selector: '.salesp-toggle-button:nth-child(2)',
        content: 'Access your settings from this button. To change to dark mode, email, password changes',
      },
      {
        selector: '.salesp-toggle-button:nth-child(3)',
        content: 'View your orders by clicking here.',
      },
      {
        selector: '.salesp-toggle-button:nth-child(4)',
        content: 'Notifications will appear here. Check for updates!',
      },
      {
        selector: '.salesp-toggle-button:nth-child(5)',
        content: 'Use this QR Scanner to scan QR codes.',
      },
      {
        selector: '.salesp-toggle-button:nth-child(6)',
        content: 'Send us feedback by clicking this button.',
      }
    ]
  : [
      {
        target: '.salesp-home-intro',
        content: 'Welcome to our store! Here you can browse our latest products.',
        placement: 'center',
      },
      {
        target: '.product-card',
        content: 'Browse through our products and find what you need!',
      },
      {
        target: '.salesp-toggle-button',
        content: 'Click here to open the main navigation menu.',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:first-child',
        content: 'This is your cart. Check your added items here.',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:nth-child(2)',
        content: 'Access your settings from this button. To change to dark mode, email, password changes',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:nth-child(3)',
        content: 'View your orders by clicking here.',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:nth-child(4)',
        content: 'Notifications will appear here. Check for updates!',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:nth-child(5)',
        content: 'Use this QR Scanner to scan QR codes.',
        placement: 'right',
      },
      {
        target: '.salesp-toggle-button:nth-child(6)',
        content: 'Send us feedback by clicking this button.',
        placement: 'right',
      },
      {
        target: '.salesp-home-footer',
        content: 'Don’t forget to check the footer for additional information!',
      },
    ];

const [steps, setSteps] = useState(initialSteps);


  const [isJoyrideActive, setJoyrideActive] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) { // Check if the prompt is available
      deferredPrompt.prompt(); // Show the prompt
      deferredPrompt.userChoice.then((choiceResult) => { // Wait for the user's response
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true); // Mark as installed if accepted
        }
        setDeferredPrompt(null); // Clear the prompt so it doesn't show again
      });
    }
  };
  
  useEffect(() => {
    // Check if the user has already seen the Joyride
    const hasSeenJoyride = localStorage.getItem('hasSeenJoyride');
    if (!hasSeenJoyride) {
      // Delay the Joyride to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        setJoyrideActive(true);
      }, 2000); // Adjust the delay as needed
  
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const checkTargets = () => {
      steps.forEach((step, index) => {
        const targetElement = document.querySelector(step.target);
        if (!targetElement) {
          console.error(`Target not found for step ${index + 1}:`, step.target);
        }
      });
    };
  
    checkTargets();
  }, [steps]);

  const [isTourActive, setTourActive] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setTourActive(true);
      }, 2000); // Adjust delay if needed
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourClose = () => {
    setTourActive(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  

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
    localStorage.removeItem('hasSeenJoyride');
    navigate('/logout');
  };
  

  // Handle back button press
  useEffect(() => {
    const handlePopState = async () => {
      setIsFeedbackVisible(false);
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

  const phoneNumber = '254116293386'; 
  const message = 'Hello, I have a question'; 
  
  const toggleWhatsApp = async () => {
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

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



  const handleJoyrideCallback = (data) => {
    const { action, status } = data;
   
    if (action === "close") {
      setJoyrideActive(false); // Hide Joyride
    }
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      setJoyrideActive(false);
      setIsFeedbackVisible(false); 
      localStorage.setItem('hasSeenJoyride', 'true');
    }
  };



  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };


  return (
    <div className="salesp-home">

       {isMobile ?(
        <>
          <Tour
            steps={steps}
            isOpen={isTourActive}
            onRequestClose={handleTourClose}
            // Optionally, you can customize styling with props like accentColor:
            // accentColor="#5cb7b7"
          />

        </>
       ):
       (
        <>
        <ReactJoyride
        steps={steps}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        run={isJoyrideActive}
        disableScrolling
        disableOverflow
        spotlightClicks={false}
        className="custom-joyride"
      />
       </>
       )}




      <Header 
      username={businessname}
      />
      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
      {!isInstalled &&
        (
          <div className="install-prompt">
            <p>Install this web app for a better experience.</p>
            <button onClick={handleInstall}>Install</button>
          </div>
        )
      };
      {isMobile ? (
              <main className="salesp-main">
                {!setnavop ?
                (
                  <div className="salesp-home-intro">
                      <NewProductList 
                      username={businessname}
                      />
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
          <NewProductList 
          username={businessname}
          />
        </div>
        
        {/* Settings Section */}
        {isSettingsVisible && (
          <section className="salesp-settings-section">
            <Settings />

          </section>
        )}
        {/* Display Order Section */}
        {isOrderVisible && (
          <section className="salesp-order-section">
            <Displayorder />

          </section>
        )}
        {/* Notifications Section */}
        {isNotificationsVisible && (
          <section className="salesp-notifications-section">
            <Notifications username={username} onMarkAsRead={() => setUnreadCount((count) => count - 1)} />

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

          </section>
        )}

        {isWhatsappVisible&& (
          <section  className="salesp-settings-section">
            < WhatsAppButton />
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
                    <button className="salesp-toggle-button"  onClick={toggleWhatsApp}>
                      <FaWhatsapp /> {/* FaWhatsapp Icon */}
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


export default Shop;

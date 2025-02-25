import React, { useEffect, useState, useCallback } from 'react';
import { FaBell, FaCog, FaWhatsapp } from 'react-icons/fa';
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
import ShareAccountSection from './shareaccount';
import { useIsMobile } from '../utils/mobilecheck';
import ReactJoyride from 'react-joyride';
import Tour from 'reactour';


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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const isMobile = useIsMobile();
  const initialSteps = isMobile
  ? [
      {
        selector: '.home',
        content: 'Welcome to your shop.',
      },
      {
        selector: '#Show-My-Products',
        content: 'To view all your products.',
      },
      {
        selector: '#Add-New-Product',
        content: 'Form to post your products.',
      },
      {
        selector: '#View-Performance',
        content: 'View all sales performance.',
      },
      {
        selector: '#settings',
        content: 'Click this button.',
      },
      {
        selector: '.home-settings-section #withdrawals',
        content: 'Money withdrawals.',
      },
      {
        selector:'.home-settings-section #allsettings',
        content: 'Get all your accout settings from here.',
      },
      {
        selector: '.home-settings-section #allsettings #allow ',
        content: 'Make sure you allow notificatttions to stay updated with orders',
      },
      {
        selector: '.home-settings-section #customs',
        content: 'Customize your shop from here!',
      },
      {
        selector: '#notifications',
        content: 'View all your notifications.',
      },
      {
        selector:  '#orders',
        content: 'View all orders',
      },

    ]
  : [
      {
        target: '.home',
        content: 'Welcome to your shop.',
        placement: 'center',
      },
      {
        target: '#Show-My-Products',
        content: 'To view all your products.',
        placement: 'left',
      },
      {
        target: '#Add-New-Product',
        content: 'Form to post your products',
      },
      {
        target: '#View-Performance',
        content: 'View all sales performance',
        placement: 'right',
      },
      {
        target: '#settings',
        content: 'Click this button ',
        placement: 'right',
      },
      {
        target: '.home-settings-section #withdrawals',
        content: 'Money withdrawals.',
        placement: 'right',
      },
      {
        target: '.home-settings-section #allsettings',
        content: 'Get all your accout settings from here.',
        placement: 'right',
      },
      {
        target: '.home-settings-section #allsettings #allow ',
        content: 'Make sure you allow notificatttions to stay updated with orders',
        placement: 'right',
      },
      {
        target: '.home-settings-section #customs',
        content: 'Customize your shop from here!',
        placement: 'right',
      },
      {
        target: '#notifications',
        content: 'View all your notifications.',
        placement: 'right',
      },
      {
        target: '#orders',
        content: 'View all orders',
        placement: 'right',
      },
    ];

  const [steps, setSteps] = useState(initialSteps);
  const [isJoyrideActive, setJoyrideActive] = useState(false);

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

  const handleJoyrideCallback = (data) => {
    const { action, status } = data;
   
    if (action === "close") {
      setJoyrideActive(false); // Hide Joyride
    }
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      setJoyrideActive(false);
      localStorage.setItem('hasSeenJoyride', 'true');
    }
  };


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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      });
    }
  };

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

  const phoneNumber = '254116293386'; 
  const message = 'Hello, I have a question'; 

  const toggleWhatsApp = async () => {
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
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
      <Header />

      {  /*    {!isInstalled &&
        (
          <div className="install-prompt">
            <p>Install this web app for a better experience.</p>
            <button onClick={handleInstall}>Install</button>
          </div>
        )
      };*/}
          <div className="install-prompt">
            <p>We're currently experiencing an issue with image display. Our team is actively working to resolve it as soon as possible. We appreciate your patience and will update you once it's fixed!</p>
          </div>
      <main className="home-main">
        {/* Main Content */}
        
        {!setnavop ? (
          <section className="home-intro">
          <div className="home-toggle-buttons">
            <button
              id='Show-My-Products'
              className={`home-settings-button ${activeSection === 'product-list' ? 'active' : ''}`}
              onClick={() => setActiveSection('product-list')}
            >
              Show My Products
            </button>
            <button
              id='Add-New-Product'
              className={`home-settings-button ${activeSection === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveSection('add-product')}
            >
              Add New Product
            </button>
            <button
              id='View-Performance'
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
            <div className="allset" id='withdrawals'>
            <Withdrawal />
            </div>
            
            <div className="allset" id='allsettings'> 
            <Settings />
            </div>
            
            <div className="allset" id='customs'>
            <ShopSettings />
            <ShareAccountSection username={username} />
            </div>
            
          </section>

          {/* Notifications Section */}
          <section id='' className={`home-notifications-section ${uiState.notifications ? 'active' : ''}`}>
            <Notifications />
          </section>

          {/* Shop Settings Section */}
          <section id='' className={`home-shop-settings-section ${uiState.shopSettings ? 'active' : ''}`}>
            <Displayorder />
          </section>
        </div>
        )

        }
        
      </main>

      {/* Floating Action Buttons (Mobile Only) */}
      <div className="salesp-floating-buttons">
        <button id='settings' className="salesp-toggle-button" onClick={() => toggleVisibility('settings')}>
          <FaCog />
        </button>

        <button id='notifications' className="salesp-toggle-button" onClick={() => toggleVisibility('notifications')}>
        <FaBell />
          {unreadNotifications > 0 && (
            <span className="salesp-notification-count">{unreadNotifications}</span>
          )}
         
        </button>
        <button id="whatsapp" className="salesp-toggle-button" onClick={() => toggleWhatsApp()}>
            < FaWhatsapp/>
        </button>
        
        <button id='orders' className="salesp-toggle-button" onClick={() => toggleVisibility('shopSettings')}>
          <BsBoxFill />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Home; 

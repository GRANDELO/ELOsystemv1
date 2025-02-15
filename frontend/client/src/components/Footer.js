import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'; // Import social icons
import { FiArrowUp } from "react-icons/fi";
import axiosInstance from './axiosInstance'
import './styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await axiosInstance.post('/subscribe', { email })
        alert(response.data.message);
      }catch (error){
        alert(error.response?.data?.message || 'Subscription failed. Please try again.');
      }
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Company Info */}
        <div className="footer-column">
          <h4>About Bazelink</h4>
          <p>Bazelink, Nairobi</p>
          <p>
            Email: <a href="mailto:Bazelink.ltd@gmail.com">Bazelink.ltd@gmail.com</a>
          </p>
          <p>Phone: +254 116293386</p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="https://www.partner.bazelink.co.ke" target="_blank" rel="noopener noreferrer">Become a Partner</a></li>
            <li><a href="https://www.partner.bazelink.co.ke/sellerlogin" target="_blank" rel="noopener noreferrer">Become a Seller</a></li>
            <li><a href="https://www.partner.bazelink.co.ke/agentLogin" target="_blank" rel="noopener noreferrer">Become an Agent</a></li>
            <li><a href="https://www.partner.bazelink.co.ke/deliveryLogin" target="_blank" rel="noopener noreferrer">Become a Delivery Person</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-column">
          <h4>Stay Connected</h4>
          <form className="footer-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your Email"
              className="footer-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="footer-button">Subscribe</button>
          </form>
        </div>
      </div>

      {showScroll && (
        <button onClick={scrollToTop} className="ft-scroll-top"><FiArrowUp/></button>
      )}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Bazelink Inc. All rights reserved. | Built by Bazelink
        </p>
      </div>
    </footer>
  );
};

export default Footer;

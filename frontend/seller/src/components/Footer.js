import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaArrowUp } from 'react-icons/fa'; // Import social icons
import './styles/Footer.css';
import { FiArrowDown, FiArrowUp, FiXCircle } from "react-icons/fi";
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      alert('Thank you for subscribing!');
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

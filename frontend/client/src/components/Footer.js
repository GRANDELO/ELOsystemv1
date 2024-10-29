import React, { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
  ];

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Insert API call or logic for handling the subscription
      console.log('Subscribed with email:', email);
    }
  };

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.footerContent}>
        {/* Section 1: Company Information */}
        <div style={styles.section}>
          <h4>About Us</h4>
          <p>Grandelo, Nairobi</p>
          <p>Email: grandeloltd1@gmail.com</p>
          <p>Phone: +254 799169720</p>
        </div>

        {/* Section 2: Quick Links */}
        <div style={styles.section}>
          <h4>Quick Links</h4>
          <ul style={styles.linkList}>
            <li><a href="/" aria-label="Navigate to Home">Home</a></li>
            <li><a href="/services" aria-label="Navigate to Services">Services</a></li>
            <li><a href="/contact" aria-label="Navigate to Contact Us">Contact Us</a></li>
            <li><a href="/about" aria-label="Navigate to About Us">About Us</a></li>
          </ul>
        </div>

        {/* Section 3: Follow Us */}
        <div style={styles.section}>
          <h4>Follow Us</h4>
          <ul style={styles.socialList}>
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${link.name}`}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Newsletter Subscription */}
        <div style={styles.section}>
          <h4>Subscribe to our Newsletter</h4>
          <form onSubmit={handleSubscribe} style={styles.form}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={handleEmailChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Subscribe</button>
          </form>
          {isSubmitted && <p style={styles.successMessage}>Thank you for subscribing!</p>}
        </div>
      </div>

      <div style={styles.footerBottom}>
        <p>&copy; {currentYear} Grandelo Inc. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: {
    backgroundColor: 'black',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: '20px',
  },
  section: {
    flex: '1 1 200px',
    margin: '10px',
    textAlign: 'left',
  },
  linkList: {
    listStyleType: 'none',
    padding: 0,
  },
  socialList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    gap: '10px',
  },
  footerBottom: {
    marginTop: '20px',
    borderTop: '1px solid #444',
    paddingTop: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '250px',
  },
  button: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  successMessage: {
    color: '#4CAF50',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default Footer;

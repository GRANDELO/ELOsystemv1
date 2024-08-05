// Footer.js

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>&copy; {currentYear} Grandelo</p>
    </footer>
  );
};

export default Footer;

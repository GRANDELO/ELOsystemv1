import React from 'react';
import { Link } from 'react-router-dom';
import './styles/ThankYou.css';

function Success() {
  return (
    <div className="container">
      <h2>Account Verified Successfully!</h2>
      <p>Your account has been verified. You can now <Link to="/">Login</Link>.</p>
    </div>
  );
}

export default Success;

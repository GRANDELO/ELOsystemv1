import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import Settings from './settings';
import './styles/Home.css';
const Home = () => {
  const username = getUsernameFromToken();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/logout');
  };
  const showprofile =() =>
    {

    }
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Grandelo, {username}</h1>
        <p>Your go-to platform to buy anything</p>
        <button onClick={handleLogout}>Logout</button>

      </header>
      <main>
          <section className="user-section">
            <Settings />
        </section>
        <section className="home-intro">
          <h2>About Us</h2>
          <p>
              At Grandelo, we are committed to providing the best market place. 
              Our team of experts is dedicated to ensuring you have the best experience.
          </p>
          <p>
            <strong>This is the seller home page </strong>
          </p>
          <p>If you want to upload data <Link to="/productForm">upload data</Link></p>
        </section>
      </main>

      <footer className="home-footer">
        <p>Contact us: grandeloltd1@gmail.com</p>
        <p>&copy; 2024 Grandelo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

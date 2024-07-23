import React from 'react';
import { Link } from 'react-router-dom';
import { getUsernameFromToken, logout } from '../utils/auth';
import './Home.css';
import ProductList from './ProductsList';

const Home = () => {
  const username = getUsernameFromToken();
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Grandelo, {username}</h1>
        <p>Your go-to platform to buy anything</p>
        <button onClick={logout} className="logout-button">Logout</button>
      </header>
      <section className="home-intro">
        <h2>About Us</h2>
        <p>
          At Grandelo, we are committed to providing the best market place. 
          Our team of experts is dedicated to ensuring you have the best experience.
        </p>
      </section>
      <section className="home-features">
        <h2>Features</h2>
        <section>
          <ProductList />
        </section>
      </section>
      <p>If you want to upload data <Link to="/productForm">upload data</Link></p>
      <footer className="home-footer">
        <p>Contact us: grandeloltd1@gmail.com</p>
        <p>&copy; 2024 Grandelo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

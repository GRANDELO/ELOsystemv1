import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ProductList from './ProductsList';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Grandelo</h1>
        <p>Your go-to platform to buy anything</p>
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
        <ul>
          <li>Feature 1: Description of feature 1.</li>
          <li>Feature 2: Description of feature 2.</li>
          <li>Feature 3: Description of feature 3.</li>
        </ul>
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

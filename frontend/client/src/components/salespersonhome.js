import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import ProductList from './ProductsList';
import Header from './header';
import Settings from './settings';
import './styles/Home.css';

const Home = () => {
  const username = getUsernameFromToken();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/logout');
  };
  return (
    <div className="home">
    <Header/>
    <main>
      <section className="user-section">
          <Settings />
      </section>
      <section>
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

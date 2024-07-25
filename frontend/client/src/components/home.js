import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewProductForm from './NewProductForm';
import Header from './header';
import Settings from './settings';
import './styles/Home.css';
const Home = () => {
  const navigate = useNavigate();
  const showprofile =() =>
    {

    }
  return (
    <div className="home">
      <Header/>
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
          <NewProductForm/>
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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import Cart from './Cart';
import NewProductList from './NewProductList';
import Header from './header';
import Settings from './settings';
import './styles/Home.css';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = getUsernameFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
        setCart(response.data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCart();
    }
  }, [username]);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="home">
      <Header />
      <main>
        <section className="user-section">
          {!loading && !error && cart.length > 0 && <Cart cart={cart} setCart={setCart} />}
          <Settings />
        </section>
        <section className="home-intro">
            
            <section>
              <NewProductList />
            </section>
          </section>
      </main>
      <footer className="home-footer">
        <p>Contact us: grandeloltd1@gmail.com</p>
        <p>&copy; 2024 Grandelo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

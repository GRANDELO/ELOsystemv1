import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import './styles/Cart.css'; // Import the custom CSS

const Cart = ({ cart, setCart }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const username = getUsernameFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setError('');
      try {
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
        setCart(response.data.items || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    };

    if (username) {
      fetchCart();
    }
  }, [username, setCart]);

  const handleRemoveFromCart = async (product) => {
    try {
      setMessage('');
      setError('');
      const removeResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/cart/remove', 
        { username, productId: product._id }
      );
      setMessage(removeResponse.data.message);

      // Refetch the cart after removal
      const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
      setCart(response.data.items || []);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      setMessage('');
      setError('');
      const clearResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/cart/clear', 
        { username }
      );
      setMessage(clearResponse.data.message);
      setCart([]); // Clear the cart
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleOrder = () => {
    navigate('/order');
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item) => (
            // Add a check to ensure item.product is not null or undefined
            item.product ? (
              <li key={item.product._id}>
                <p>{item.product.name} - Ksh {item.product.price} x {item.quantity}</p>
                <Button variant="danger" onClick={() => handleRemoveFromCart(item.product)}>
                  Remove
                </Button>
              </li>
            ) : (
              <li key={item._id}>Invalid product</li> // Fallback if item.product is null
            )
          ))}
        </ul>
      )}
      <Button 
        className="btn-success" 
        onClick={handleOrder} 
        disabled={cart.length === 0}
      >
        Make Order
      </Button>
      <Button 
        className="btn-clear" 
        onClick={handleClearCart} 
        disabled={cart.length === 0}
      >
        Clear Cart
      </Button>
    </div>
  );
};

export default Cart;

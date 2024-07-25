import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';

const Cart = () => {
  const { cart, dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const username = getUsernameFromToken();

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setMessage('');
        setError('');
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart', { username });
        dispatch({ type: 'SET_CART', payload: response.data.items });
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    };

    fetchCart();
  }, [dispatch, username]);

  const handleRemoveFromCart = async (product) => {
    try {
      setMessage('');
      setError('');
      const removeResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/remove', 
        { username, productId: product._id }
      );
      setMessage(removeResponse.data.message);

      const response = await axios.post('https://elosystemv1.onrender.com/api/cart', { username });
      dispatch({ type: 'SET_CART', payload: response.data.items });
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      setMessage('');
      setError('');
      const clearResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/clear', 
        { username }
      );
      setMessage(clearResponse.data.message);
      dispatch({ type: 'SET_CART', payload: [] });
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
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
            <li key={item.product._id}>
              {item.product.name} - Ksh {item.product.price} x {item.quantity}
              <Button variant="danger" onClick={() => handleRemoveFromCart(item.product)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button variant="danger" onClick={handleClearCart} disabled={cart.length === 0}>
        Clear Cart
      </Button>
    </div>
  );
};

export default Cart;

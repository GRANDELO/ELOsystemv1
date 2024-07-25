import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { getUsernameFromToken } from '../utils/auth';

const Cart = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = getUsernameFromToken();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
        setCart(response.data.items || []); // Ensure cart is set to an empty array if no items
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError(err.response?.data?.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCart();
    }
  }, [username]);

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

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
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

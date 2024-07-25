import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, dispatch } = useCart();

  const handleRemoveFromCart = async (product) => {
    try {
      await axios.post('https://elosystemv1.onrender.com/api/cart/remove', 
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const response = await axios.get('https://elosystemv1.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch({ type: 'SET_CART', payload: response.data.items });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.post('https://elosystemv1.onrender.com/api/cart/clear', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch({ type: 'SET_CART', payload: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item._id}>
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

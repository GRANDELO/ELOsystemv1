import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';

const OrderingPage = () => {
  const username = getUsernameFromToken();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('https://elosystemv1.onrender.com/api/cart/cart', { username });
        setCart(response.data.items || []);
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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSubmitOrder = async () => {
    if (!paymentMethod || !destination) {
      setError('Please select a payment method and provide a delivery destination.');
      return;
    }

    try {
      const orderDetails = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        totalPrice: cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
        paymentMethod,
        destination,
        orderDate: new Date().toISOString(),
        username
      };

      const response = await axios.post('https://elosystemv1.onrender.com/api/orders', orderDetails);
      setMessage(response.message);
      
    } catch (err) {
      console.error('Failed to submit order:', err);
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="ordering-page">
      <h1>Order Page</h1>
      {message && <Alert variant="success">{message}</Alert>}
      <h2>Total Price: Ksh {totalPrice.toFixed(2)}</h2>
      
      {/* Display Cart Items */}
      <div>
        <h3>Cart Items</h3>
        <ul>
          {cart.length > 0 ? (
            cart.map((item) => (
              <li key={item.product._id}>
                {item.product.name} - Ksh {item.product.price} x {item.quantity}
              </li>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </ul>
      </div>

      {/* Delivery Destination */}
      <Form.Group>
        <Form.Label>Delivery Destination</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your delivery address"
          value={destination}
          onChange={handleDestinationChange}
        />
      </Form.Group>

      {/* Payment Method Selection */}
      <Form>
        <Form.Group>
          <Form.Label>Payment Method</Form.Label>
          <Form.Check
            type="radio"
            label="M-Pesa"
            name="paymentMethod"
            value="mpesa"
            checked={paymentMethod === 'mpesa'}
            onChange={handlePaymentMethodChange}
          />
          <Form.Check
            type="radio"
            label="Payment on Delivery"
            name="paymentMethod"
            value="delivery"
            checked={paymentMethod === 'delivery'}
            onChange={handlePaymentMethodChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSubmitOrder} disabled={cart.length === 0}>
          Submit Order
        </Button>
      </Form>
    </div>
  );
};

export default OrderingPage;

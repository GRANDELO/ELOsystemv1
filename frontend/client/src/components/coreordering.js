import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getUsernameFromToken } from '../utils/auth';
import './styles/OrderingPage.css';

const OrderingPage = () => {
  const username = getUsernameFromToken();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');
  const [mpesaPhoneNumberError, setMpesaPhoneNumberError] = useState('');
  const [message, setMessage] = useState('');
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [loginPrompt, setLoginPrompt] = useState(''); // For storing login prompt if user isn’t logged in
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const sellerOrderId = queryParams.get('sellerOrderId');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        sessionStorage.setItem('currentpage', `/coreorder?sellerOrderId=${sellerOrderId}&productId=${productId}`);
        const response = await axios.get(`https://elosystemv1.onrender.com/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/locations');
        setTowns(response.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError(err.response?.data?.message || 'Failed to fetch locations');
      }
    };

    fetchLocations();
  }, []);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleMpesaPhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    setMpesaPhoneNumber(phoneNumber);

    const phoneNumberPattern = /^(2547|2541)\d{8}$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      setMpesaPhoneNumberError('Please enter a valid 12-digit phone number starting with 2547 or 2541.');
    } else {
      setMpesaPhoneNumberError('');
    }
  };

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setSelectedTown(selectedTown);
    const town = towns.find((t) => t.town === selectedTown);
    setAreas(town ? town.areas : []);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSubmitOrder = async () => {
    // Check if user is logged in
    if (!username) {
      setLoginPrompt('You have to sign in to complete the order. If you don’t have an account, please register.');
      return;
    }

    if (!paymentMethod || !selectedTown || !selectedArea || (paymentMethod === 'mpesa' && !mpesaPhoneNumber)) {
      setError('Please select a payment method, provide a delivery destination, and enter M-Pesa phone number if applicable.');
      return;
    }

    if (mpesaPhoneNumberError) {
      setError('Please correct the errors in the form.');
      return;
    }

    const orderReference = uuidv4(); // Generate unique order reference
    const totalPrice = product.price; // Assuming quantity = 1 for simplicity

    try {
      const orderDetails = {
        items: [{ productId, quantity: 1 }],
        totalPrice,
        paymentMethod,
        destination: `${selectedTown}, ${selectedArea}`,
        orderDate: new Date().toISOString(),
        username,
        mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
        orderReference,
        sellerOrderId,
      };

      const response = await axios.post('https://elosystemv1.onrender.com/api/orders', orderDetails);
      setMessage(response.data.message);

      if (paymentMethod === 'mpesa') {
        const payload = {
          phone: mpesaPhoneNumber,
          amount: totalPrice.toFixed(0),
          orderReference: orderReference,
        };

        try {
          const response = await axios.post('https://elosystemv1.onrender.com/api/mpesa/lipa', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setMessage('Payment initiated successfully!');
          setTimeout(() => {
            navigate('/salespersonhome');
          }, 3000);
        } catch (error) {
          setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
          console.error('Error:', error);
        }
      } else {
        setTimeout(() => {
          navigate('/salespersonhome');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="ordering-page">
      <h1>Order Page</h1>
      {loginPrompt && (
        <Alert variant="warning">
          {loginPrompt} <a href="/">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
      {message && <Alert variant="success">{message}</Alert>}
      <h2>Total Price: Ksh {product?.price.toFixed(2)}</h2>

      {/* Display Product Details */}
      {product && (
        <div>
          <h3>{product.name}</h3>
          <img src={product.image} alt={product.name} className="product-image" />
          <p>Price: Ksh {product.price}</p>
          <p>{product.description}</p>
        </div>
      )}

      {/* Delivery Destination */}
      <Form.Group>
        <Form.Label>Town</Form.Label>
        <Form.Control as="select" value={selectedTown} onChange={handleTownChange}>
          <option value="">Select Town</option>
          {towns.map((town) => (
            <option key={town.town} value={town.town}>
              {town.town}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {selectedTown && (
        <Form.Group>
          <Form.Label>Area</Form.Label>
          <Form.Control as="select" value={selectedArea} onChange={handleAreaChange}>
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}

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
            label="Cash on Delivery"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={handlePaymentMethodChange}
          />
        </Form.Group>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <Form.Group>
            <Form.Label>M-Pesa Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={mpesaPhoneNumber}
              onChange={handleMpesaPhoneNumberChange}
              placeholder="2547XXXXXXXX"
            />
            {mpesaPhoneNumberError && <Alert variant="danger">{mpesaPhoneNumberError}</Alert>}
          </Form.Group>
        )}

        {/* Submit Order Button */}
        <Button variant="primary" onClick={handleSubmitOrder}>
          Submit Order
        </Button>
      </Form>
    </div>
  );
};

export default OrderingPage;
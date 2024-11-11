import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getUsernameFromToken } from '../utils/auth';
import './styles/coreorder.css';

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
  const [loginPrompt, setLoginPrompt] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Query parameters
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const sellerOrderId = queryParams.get('sellerOrderId');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      sessionStorage.setItem('currentpage', `coreorder?sellerOrderId=${sellerOrderId}&productId=${productId}`);
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/locations');
        setTowns(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch locations');
      }
    };
    fetchLocations();
  }, []);

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handleMpesaPhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    setMpesaPhoneNumber(phoneNumber);
    const phoneNumberPattern = /^(2547|2541)\d{8}$/;
    setMpesaPhoneNumberError(!phoneNumberPattern.test(phoneNumber) ? 'Please enter a valid 12-digit phone number starting with 2547 or 2541.' : '');
  };

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setSelectedTown(selectedTown);
    const town = towns.find((t) => t.town === selectedTown);
    setAreas(town ? town.areas : []);
    setSelectedArea(''); // Reset area when town changes
  };

  // Add the missing handleAreaChange function
  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSubmitOrder = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to complete the order.');
      return;
    }
    if (!paymentMethod || !selectedTown || !selectedArea || (paymentMethod === 'mpesa' && !mpesaPhoneNumber) || mpesaPhoneNumberError) {
      setError('Please complete the form.');
      return;
    }
    try {
      const orderDetails = {
        items: [{ productId, quantity: 1 }],
        totalPrice: product.price,
        paymentMethod,
        destination: `${selectedTown}, ${selectedArea}`,
        orderDate: new Date().toISOString(),
        username,
        mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
        orderReference: uuidv4(),
        sellerOrderId,
      };
      const response = await axios.post('https://elosystemv1.onrender.com/api/orders', orderDetails);
      setMessage(response.data.message);
      setTimeout(() => navigate('/salespersonhome'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="ordcore-ordering-page">
      <h1 className="ordcore-heading">Order Page</h1>
      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
      {message && <Alert variant="success" className="ordcore-message">{message}</Alert>}
      <h2 className="ordcore-total-price">Total Price: Ksh {product?.price.toFixed(2)}</h2>

      {product && (
        <div className="ordcore-product-details">
          <h3 className="ordcore-product-name">{product.name}</h3>
          <img src={product.image} alt={product.name} className="ordcore-product-image" />
          <p className="ordcore-product-price">Price: Ksh {product.price}</p>
          <p className="ordcore-product-description">{product.description}</p>
        </div>
      )}

      <Form.Group className="ordcore-form-group">
        <Form.Label>Town</Form.Label>
        <Form.Control as="select" value={selectedTown} onChange={handleTownChange} className="ordcore-select">
          <option value="">Select Town</option>
          {towns.map((town) => (
            <option key={town.town} value={town.town}>{town.town}</option>
          ))}
        </Form.Control>
      </Form.Group>

      {selectedTown && (
        <Form.Group className="ordcore-form-group">
          <Form.Label>Area</Form.Label>
          <Form.Control as="select" value={selectedArea} onChange={handleAreaChange} className="ordcore-select">
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </Form.Control>
        </Form.Group>
      )}

      <Form>
        <Form.Group className="ordcore-form-group">
          <Form.Label>Payment Method</Form.Label>
          <Form.Check
            type="radio"
            name="paymentMethod"
            label="Mpesa"
            value="mpesa"
            onChange={handlePaymentMethodChange}
            className="ordcore-radio-label"
          />
          <Form.Check
            type="radio"
            name="paymentMethod"
            label="On Delivery"
            value="ondelivery"
            onChange={handlePaymentMethodChange}
            className="ordcore-radio-label"
          />
        </Form.Group>

        {paymentMethod === 'mpesa' && (
          <Form.Group className="ordcore-form-group">
            <Form.Label>Mpesa Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={mpesaPhoneNumber}
              onChange={handleMpesaPhoneNumberChange}
              className="ordcore-form-control ordcore-phone-number"
              placeholder="Enter Mpesa Phone Number"
              isInvalid={!!mpesaPhoneNumberError}
            />
            <Form.Control.Feedback type="invalid">
              {mpesaPhoneNumberError}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Form>

      {error && <Alert variant="danger" className="ordcore-alert">{error}</Alert>}

      <Button onClick={handleSubmitOrder} className="ordcore-submit-btn">Submit Order</Button>
    </div>
  );
};

export default OrderingPage;

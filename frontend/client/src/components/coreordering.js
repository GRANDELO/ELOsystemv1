import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Extract sellerOrderId and productId from the URL params
  const { sellerOrderId, productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
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

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

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
    const town = towns.find(t => t.town === selectedTown);
    setAreas(town ? town.areas : []);
  };

  const handleAreaChange = (e) => setSelectedArea(e.target.value);

  
  const handleSubmitOrder = async () => {
    if (!paymentMethod || !selectedTown || !selectedArea || (paymentMethod === 'mpesa' && !mpesaPhoneNumber)) {
      setError('Please complete all required fields.');
      return;
    }

    if (mpesaPhoneNumberError) {
      setError('Please correct the errors in the form.');
      return;
    }

    const orderReference = uuidv4(); // Unique order reference
    const orderDetails = {
      productId,
      quantity: 1,
      paymentMethod,
      destination: `${selectedTown}, ${selectedArea}`,
      orderDate: new Date().toISOString(),
      username,
      mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
      orderReference,
      sellerOrderId
    };

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/orders', orderDetails);
      setMessage(response.data.message);

      if (paymentMethod === 'mpesa') {
        const paymentPayload = {
          phone: mpesaPhoneNumber,
          amount: product.price.toFixed(0),
          orderReference
        };

        try {
          const mpesaResponse = await axios.post('https://elosystemv1.onrender.com/api/mpesa/lipa', paymentPayload);
          setMessage('Payment initiated successfully!');
          setTimeout(() => navigate('/salespersonhome'), 3000);
        } catch (paymentError) {
          setMessage('Payment initiation failed.');
          console.error('Error:', paymentError);
        }
      } else {
        setTimeout(() => navigate('/salespersonhome'), 3000);
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
      {message && <Alert variant="success">{message}</Alert>}
      {product && (
        <div>
          <h2>{product.name}</h2>
          <p>Price: Ksh {product.price.toFixed(2)}</p>
        </div>
      )}
      
      {/* Delivery and Payment Form */}
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

      <Form.Group>
        <Form.Label>Payment Method</Form.Label>
        <Form.Check type="radio" label="M-Pesa" name="paymentMethod" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={handlePaymentMethodChange} />
        <Form.Check type="radio" label="Cash on Delivery" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentMethodChange} />
      </Form.Group>

      {paymentMethod === 'mpesa' && (
        <Form.Group>
          <Form.Label>M-Pesa Phone Number</Form.Label>
          <Form.Control type="text" value={mpesaPhoneNumber} onChange={handleMpesaPhoneNumberChange} placeholder="2547XXXXXXXX" />
          {mpesaPhoneNumberError && <Alert variant="danger">{mpesaPhoneNumberError}</Alert>}
        </Form.Group>
      )}

      <Button variant="primary" onClick={handleSubmitOrder}>
        Submit Order
      </Button>
    </div>
  );
};

export default OrderingPage;

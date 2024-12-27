import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getUsernameFromToken } from '../utils/auth';
import './styles/OrderingPage.css'; // Add the custom CSS

const OrderingPage = () => {
  const username = getUsernameFromToken();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nloading, setnLoading] = useState(false);
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
  
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.post('/cart/cart', { username });
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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/locations');
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
    const town = towns.find(t => t.town === selectedTown);
    setAreas(town ? town.areas : []);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleClearCart = async () => {
    try {
      setMessage('');
      setError('');
      const clearResponse = await axiosInstance.post('/cart/cart/clear', 
        { username }
      );
      setMessage(clearResponse.data.message);
      setCart([]); // Clear the cart
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleSubmitOrder = async () => {
    setnLoading(true)
    if (!paymentMethod || !selectedTown || !selectedArea || (paymentMethod === 'mpesa' && !mpesaPhoneNumber)) {
      setError('Please select a payment method, provide a delivery destination, and enter M-Pesa phone number if applicable.');
      setnLoading(false)
      return;
    }

    if (mpesaPhoneNumberError) {
      setError('Please correct the errors in the form.');
      setnLoading(false)
      return;
    }

    const orderReference = uuidv4(); // Generate unique order ref

    try {
      const orderDetails = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.discount 
            ? item.product.price * (1 - item.product.discountpersentage / 100) // Apply discount if exists
            : item.product.price
        })), 
        variations: cart.map(item => ({
          productId: item.variant.productId,
          color: item.variant.color,
          size: item.variant.size,
          material: item.variant.material,
          model: item.variant.model,

        })), 


        totalPrice: cart.reduce((total, item) => {
          const price = item.product.discount
            ? item.product.price * (1 - item.product.discountpersentage / 100)
            : item.product.price;
          return total + price * item.quantity;
        }, 0),
        paymentMethod,
        destination: `${selectedTown}, ${selectedArea}`,
        orderDate: new Date().toISOString(),
        username,
        
        mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
        orderReference,
        
      };

      const response = await axiosInstance.post('/orders', orderDetails);
      setMessage(response.data.message);

      if (paymentMethod === 'mpesa') 
        {
            const payload = 
            {
                phone: mpesaPhoneNumber,
                amount: totalPrice.toFixed(0),
                orderReference: orderReference
            };

            try {
                const response = await axiosInstance.post('/mpesa/lipa', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setnLoading(false)
                handleClearCart();
                setMessage('Payment initiated successfully!');
                setTimeout(() => {
                  navigate('/');
                }, 3000);
            } catch (error) {
              setnLoading(false)
                setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
                console.error('Error:', error);
            }

      }else{
        await handleClearCart();
        setMessage('Order placed successfully!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

      // Send order details to the logistics system
      //await axios.post('https://elosystemv1.onrender.com/api/logistics', orderDetails);


    } catch (err) {
      console.error('Failed to submit order:', err);
      setnLoading(false);
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const price = item.product.discount
      ?   item.product.price * (1 - item.product.discountpersentage / 100)
      : item.product.price;
    return total + price * item.quantity;
  }, 0);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="ordering-page">
      <h1>Order Page</h1>

      <h2>Total Price: Ksh {totalPrice.toFixed(2)}</h2>
      
      {/* Display Cart Items */}
      <div className='detail'>
        <h3>Cart Items</h3>
        <ul>
          {cart.length > 0 ? (
            cart.map((item) => {
              const price = item.product.discount
                ? item.product.price * (1 - item.product.discountpersentage / 100)
                : item.product.price;

              // Extract variant details
              const variantDetails = Object.entries(item.variant || {}).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ));

              return (
                <li className='variant-detailsall' key={item.product._id}>
                  <div>
                    <strong>Product:</strong> {item.product.name}
                  </div>
                  <div>
                    <strong>Price:</strong> Ksh {price.toFixed(2)} x {item.quantity}
                  </div>
                  <br/>
                  <div className='variant-details'>
                    <strong>Variant:</strong>
                    {variantDetails.length > 0 ? (
                      <div className="variant-details">{variantDetails}</div>
                    ) : (
                      <span>Not Specified</span>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <p>No items in cart.</p>
          )}
        </ul>

      </div>

      {/* Delivery Destination */}
      <Form.Group className='model'>
        <Form.Label className='Label' >Town</Form.Label>
        <Form.Control  className='select' as="select" value={selectedTown} onChange={handleTownChange}>
          <option value="">Select Town</option>
          {towns.map((town) => (
            <option key={town.town} value={town.town}>
              {town.town}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {selectedTown && (
        <Form.Group className='model'>
          <Form.Label className='Label' >Area</Form.Label>
          <Form.Control className='select' as="select" value={selectedArea} onChange={handleAreaChange}>
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
        <Form.Group className='model2'>
          <Form.Label className='Label' >Payment Method</Form.Label>
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
          <Form.Group className='model'>
            <Form.Label className='Label' >M-Pesa Phone Number</Form.Label>
            <Form.Control
            className='input'
              type="text"
              value={mpesaPhoneNumber}
              placeholder='Enter the M-pesa number as 2547/2541'
              onChange={handleMpesaPhoneNumberChange}
              isInvalid={mpesaPhoneNumberError !== ''}
            />
            <Form.Control.Feedback type="invalid">
              {mpesaPhoneNumberError}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Form>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Submit Order Button */}
      <Button onClick={handleSubmitOrder}>
      {nloading ? "Ordering..." : "Make Order"}
        </Button>
      
    </div>
  );
};

export default OrderingPage;

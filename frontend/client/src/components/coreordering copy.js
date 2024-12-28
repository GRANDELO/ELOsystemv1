import axiosInstance from './axiosInstance';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState({
    color: '',
    size: '',
    material: '',
    model: '',
  });
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
      sessionStorage.setItem('currentpage', `/coreorder?sellerOrderId=${sellerOrderId}&productId=${productId}`);
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
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
        const response = await axiosInstance.get('/locations');
        setTowns(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch locations');
      }
    };
    fetchLocations();
  }, []);

  // Image rotation interval
  useEffect(() => {
    if (product?.images?.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000); // Change the image every 3 seconds

      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [product]);

  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setSelectedVariation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handleMpesaPhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    setMpesaPhoneNumber(phoneNumber);
    const phoneNumberPattern = /^(2547|2541)\d{8}$/;
    setMpesaPhoneNumberError(!phoneNumberPattern.test(phoneNumber) ? 'Please enter a valid 12-digit phone number starting with 2547 or 2541.' : '');
  };

  const calculateDiscountedPrice = () => {
    if (product.discount) {
      const discountPercentage = product.discountpersentage || 0;
      const discountedPrice = product.price - (product.price * discountPercentage) / 100;
      return {
        discountedPrice,
        savedAmount: product.price - discountedPrice,
      };
    }
    return { discountedPrice: product.price, savedAmount: 0 };
  };

  const handleClearCart = async () => {
    try {
      setMessage('');
      setError('');
      const clearResponse = await axiosInstance.post('/cart/cart/clear', 
        { username }
      );
      setMessage(clearResponse.data.message);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setSelectedTown(selectedTown);
    const town = towns.find((t) => t.town === selectedTown);
    setAreas(town ? town.areas : []);
    setSelectedArea(''); // Reset area when town changes
  };

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
    const orderReference = uuidv4(); 
    const { discountedPrice } = calculateDiscountedPrice();
    try {
      const orderDetails = {
        items: [{ productId, quantity: 1, variations: selectedVariation }],
        totalPrice: discountedPrice,
        paymentMethod,
        destination: `${selectedTown}, ${selectedArea}`,
        orderDate: new Date().toISOString(),
        username,
        mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
        orderReference: orderReference,
        sellerOrderId,
      };
      const response = await axiosInstance.post('/orders', orderDetails);
      setMessage(response.data.message);

      if (paymentMethod === 'mpesa') {
        const payload = {
          phone: mpesaPhoneNumber,
          amount: discountedPrice.toFixed(0),
          orderReference: orderReference,
        };

        try {
          const response = await axiosInstance.post('/mpesa/lipa', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setMessage('Payment initiated successfully!');
          handleClearCart();
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } catch (error) {
          setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
          console.error('Error:', error);
        }
      } else {
        await handleClearCart();
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  const { discountedPrice, savedAmount } = calculateDiscountedPrice();

  return (
    <div className="ordcore-ordering-page">
      <h1 className="ordcore-heading">Order Page</h1>
      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
      {message && <Alert variant="success" className="ordcore-message">{message}</Alert>}
      <h2 className="ordcore-total-price">Total Price: Ksh {discountedPrice.toFixed(2)}</h2>

      {product && (
        <div className="ordcore-product-details">
          <h3 className="ordcore-product-name">{product.name}</h3>
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={`product-image-${currentImageIndex}`}
                className="ordcore-product-image"
              />
            ) : (
              <p>No images available for this product.</p>
            )}
          </div>
          {product.discount ? (
            <>
              <p className="ordcore-original-price">
                Original Price: <del>Ksh {product.price.toFixed(2)}</del>
              </p>
              <p className="ordcore-product-price">
                Price: Ksh {discountedPrice.toFixed(2)}
              </p>
              <p className="ordcore-saved-amount">
                You Save: Ksh {savedAmount.toFixed(2)}
              </p>
            </>
          ) : (
            <>
              <p className="ordcore-product-price">
                Price: Ksh {product.price.toFixed(2)}
              </p>
            </>
          )}

          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>

          {product.variations && product.variations.length > 0 && (
            <div className="ordcore-variations">
              <h4 className="ordcore-variations-heading">Available Variations</h4>
              {product.variations.map((variation, index) => (
                <div key={index} className="ordcore-variation">
                  {variation.color && (
                    <div>
                      <label>Color:</label>
                      <Form.Control
                        as="select"
                        name="color"
                        value={selectedVariation.color}
                        onChange={handleVariationChange}
                        className="ordcore-select"
                      >
                        <option value="">Select Color</option>
                        <option value={variation.color}>{variation.color}</option>
                      </Form.Control>
                    </div>
                  )}
                  {variation.size && (
                    <div>
                      <label>Size:</label>
                      <Form.Control
                        as="select"
                        name="size"
                        value={selectedVariation.size}
                        onChange={handleVariationChange}
                        className="ordcore-select"
                      >
                        <option value="">Select Size</option>
                        <option value={variation.size}>{variation.size}</option>
                      </Form.Control>
                    </div>
                  )}
                  {variation.material && (
                    <div>
                      <label>Material:</label>
                      <Form.Control
                        as="select"
                        name="material"
                        value={selectedVariation.material}
                        onChange={handleVariationChange}
                        className="ordcore-select"
                      >
                        <option value="">Select Material</option>
                        <option value={variation.material}>{variation.material}</option>
                      </Form.Control>
                    </div>
                  )}
                  {variation.model && (
                    <div>
                      <label>Model:</label>
                      <Form.Control
                        as="select"
                        name="model"
                        value={selectedVariation.model}
                        onChange={handleVariationChange}
                        className="ordcore-select"
                      >
                        <option value="">Select Model</option>
                        <option value={variation.model}>{variation.model}</option>
                      </Form.Control>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Form onSubmit={handleSubmitOrder}>
        {/* Add form elements for town selection, area, payment method, and Mpesa phone number */}
        <Button type="submit" variant="primary" className="ordcore-submit-button">
          Place Order
        </Button>
      </Form>
    </div>
  );
};

export default OrderingPage;

import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getUsernameFromToken } from '../utils/auth';
import './styles/coreorder.css';

const OrderingPage = () => {
  const [locations, setLocations] = useState([]);
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
  const [specificAreas, setSpecificAreas] = useState([]);
  const [selectedSpecificArea, setSelectedSpecificArea] = useState('');
  const [others, setOthers] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const navigate = useNavigate();

  const [selectedVariation, setSelectedVariation] = useState({
    productId: "productId",
    color: "",
    size: "",
    material: "",
    model: "",
  });
  const [filteredVariations, setFilteredVariations] = useState([]);

  useEffect(() => {
    if (product && product.variations) {
      // Filter variations based on selected color
      const filtered = product.variations.filter(
        (variation) => variation.color === selectedVariation.color
      );
      setFilteredVariations(filtered);
    }
  }, [selectedVariation.color, product]);

  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setSelectedVariation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Get unique sizes for the selected color
  const sizeOptions = [
    ...new Set(
      filteredVariations.flatMap((variation) => variation.size)
    ),
  ];

  // Get unique materials for the selected color
  const materialOptions = [
    ...new Set(
      filteredVariations.flatMap((variation) => variation.material)
    ),
  ];

  // Get unique models for the selected color
  const modelOptions = [
    ...new Set(
      filteredVariations.flatMap((variation) => variation.model)
    ),
  ];

  // Query parameters

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

    const fetchagentLocations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://elosystemv1.onrender.com/api/locationsroutes'); // Replace with your actual endpoint
        const data = await response.json();
        if (data.success) {
          setLocations(data.locations);

          // Extract unique towns
          const uniqueTowns = [...new Set(data.locations.map((loc) => loc.locations?.town))];
          setTowns(uniqueTowns.filter((town) => town)); // Exclude null or undefined towns
        } else {
          setError('Failed to fetch locations. Please try again later.');
        }
      } catch (err) {
        setError('An error occurred while fetching locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchagentLocations();

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


  const handleagentTownChange = (e) => {
    const town = e.target.value;
    setSelectedTown(town);

    // Filter areas based on selected town
    const filteredAreas = locations
      .filter((loc) => loc.locations?.town === town)
      .map((loc) => loc.locations.area);

    setAreas([...new Set(filteredAreas)]);
    setSelectedArea('');
    setSpecificAreas([]);
    setSelectedSpecificArea('');
  };

  // Handle area selection
  const handleagentAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);

    // Filter specific locations based on selected area
    const filteredSpecificAreas = locations
      .filter((loc) => loc.locations?.town === selectedTown && loc.locations?.area === area)
      .map((loc) => loc.locations.specific);

    setSpecificAreas([...new Set(filteredSpecificAreas)]);
    setSelectedSpecificArea('');
  };

  // Handle specific area selection
  const handleSpecificAreaChange = (e) => {
    setSelectedSpecificArea(e.target.value);
  };


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

  // Add the missing handleAreaChange function
  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const otherschanger = () => {
    setOthers(!others);
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
        items: [{ productId, quantity: 1 }],
        totalPrice: discountedPrice,
        paymentMethod,
        destination: `${selectedTown}, ${selectedArea}, ${selectedSpecificArea || 'Town'}`,
        orderDate: new Date().toISOString(),
        username,
        mpesaPhoneNumber: paymentMethod === 'mpesa' ? mpesaPhoneNumber : undefined,
        orderReference: orderReference,
        sellerOrderId,
        variations: selectedVariation,
      };
      const response = await axiosInstance.post('/orders', orderDetails);
      setMessage(response.data.message);

      if (paymentMethod === 'mpesa') 
        {
            const payload = 
            {
                phone: mpesaPhoneNumber,
                amount: discountedPrice.toFixed(0),
                orderReference: orderReference
            };

            try {
                const response = await axiosInstance.post('/mpesa/lipa', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                handleClearCart();
                setMessage('Payment initiated successfully!');
                setTimeout(() => {
                  navigate('/');
                }, 3000);
            } catch (error) {
                setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
                console.error('Error:', error);
            }
      }else{
        await handleClearCart();
        setMessage('Order made successfully!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  const { discountedPrice, savedAmount } = calculateDiscountedPrice();

  return (
    <div className="ordcore-ordering-page">
      <h1 className="ordcore-heading">Order Page</h1>
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

              <p className="ld-price">
                Original Price: <del>Ksh {product.price.toFixed(2)}</del>
              </p>
              <p className="new-price">
                Price: Ksh {discountedPrice.toFixed(2)}
              </p>
              <p className="ordcore-saved-amount">
                You Save: Ksh {savedAmount.toFixed(2)}
              </p>
            </>
          ) : (
            <>
              <p className="discount-info">
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
          
          {/* Color selection */}
          <div>
            <label className='lables'>Color:</label>
            <Form.Control
              as="select"
              name="color"
              value={selectedVariation.color}
              onChange={handleVariationChange}
              className="ordcore-select"
            >
              <option value="">Select Color</option>
              {product.variations.map((variation, index) => (
                <option key={index} value={variation.color}>
                  {variation.color}
                </option>
              ))}
            </Form.Control>
          </div>

          {/* Size selection */}
          {selectedVariation.color && sizeOptions.length > 0 && (
            <div>
              <label className='lables'>Size:</label>
              <Form.Control
                as="select"
                name="size"
                value={selectedVariation.size}
                onChange={handleVariationChange}
                className="ordcore-select"
              >
                <option value="">Select Size</option>
                {sizeOptions.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Control>
            </div>
          )}

          {/* Material selection */}
          {selectedVariation.size && materialOptions.length > 0 && (
            <div>
              <label className='lables'>Material:</label>
              <Form.Control
                as="select"
                name="material"
                value={selectedVariation.material}
                onChange={handleVariationChange}
                className="ordcore-select"
              >
                <option value="">Select Material</option>
                {materialOptions.map((material, index) => (
                  <option key={index} value={material}>
                    {material}
                  </option>
                ))}
              </Form.Control>
            </div>
          )}

          {/* Model selection */}
          {selectedVariation.material && modelOptions.length > 0 && (
            <div>
              <label className='lables'>Model:</label>
              <Form.Control
                as="select"
                name="model"
                value={selectedVariation.model}
                onChange={handleVariationChange}
                className="ordcore-select"
              >
                <option value="">Select Model</option>
                {modelOptions.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </Form.Control>
            </div>
          )}
        </div>
      )}

        </div>
      )}

      {/* Delivery Destination */}
      {!others ? (
        <>
        {/* Town Selector */}
        <div>
          <label htmlFor="town">Town:</label>
          <select
            id="town"
            value={selectedTown}
            onChange={handleagentTownChange}
            disabled={loading || towns.length === 0}
          >
            <option value="">-- Select Town --</option>
            {towns.map((townObj, index) => (
              <option key={index} value={townObj.town || townObj}>
                {townObj.town || townObj}
              </option>
            ))}
          </select>
          {towns.length === 0 && !loading && <p>No towns available.</p>}
        </div>
      
        {/* Area Selector */}
        {areas.length > 0 && (
          <div>
            <label htmlFor="area">Area:</label>
            <select
              id="area"
              value={selectedArea}
              onChange={handleagentAreaChange}
              disabled={!selectedTown}
            >
              <option value="">-- Select Area --</option>
              {areas.map((areaObj, index) => (
                <option key={index} value={areaObj.area || areaObj}>
                  {areaObj.area || areaObj}
                </option>
              ))}
            </select>
          </div>
        )}
      
        {/* Show message if no areas are available */}
        {selectedTown && areas.length === 0 && !loading && <p>No areas available for the selected town.</p>}
      
        {/* Specific Area Selector */}
        {specificAreas.length > 0 && (
          <div>
            <label htmlFor="specific">Specific Area:</label>
            <select
              id="specific"
              value={selectedSpecificArea}
              onChange={handleSpecificAreaChange}
              disabled={!selectedArea}
            >
              <option value="">-- Select Specific Area --</option>
              {specificAreas.map((specificObj, index) => (
                <option key={index} value={specificObj.specific || specificObj}>
                  {specificObj.specific || specificObj}
                </option>
              ))}
            </select>
          </div>
        )}
       <Button onClick={otherschanger}>
          Not found my location pickup in the nearest town
      </Button>
      </>
      
      ):
      (
        <>
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
          <Button onClick={otherschanger}>
              Go back to agent locations.
          </Button>
        </>


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

      {error && <Alert variant="danger" className="ordcore-alert">{error}</Alert>}
      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
      {message && <Alert variant="success" className="ordcore-message">{message}</Alert>}
      <Button onClick={handleSubmitOrder} className="ordcore-submit-btn">Submit Order</Button>
    </div>
  );
};

export default OrderingPage;

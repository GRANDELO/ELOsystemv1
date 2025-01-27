import axiosInstance from './axiosInstance';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState, useRef } from 'react'; 
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';
import './styles/ProductModal.css';
import ReviewList from "./ReviewList";
import ProductsDetail from "./ProductsDetail";
import Productimage from "./productimage";

import AddEditReview from "./AddEditReview";
import ico from "./images/log.png";
import QRCode from "qrcode";

const ProductModal = ({ product, show, handleClose }) => {
  const canvasRef = useRef();
  const { dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [showMpesaInput, setShowMpesaInput] = useState(false); 
  const [showQrCode, setShowQrCode] = useState(false);
  const [sellerOrderId, setSellerOrderId] = useState('');
  const username = getUsernameFromToken();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loginPrompt, setLoginPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [filteredVariations, setFilteredVariations] = useState(product.variations || []); 
  const [showcore, setShowcore ] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const currentUser = getUsernameFromToken(); // Replace with getUsernameFromToken();

  const [editingReview, setEditingReview] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      handleClose(); // Close the modal when the back button is pressed
    };
  
    if (show) {
      window.history.pushState({ modal: true }, ""); // Push a state into the history
    }
  
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (show) {
        window.history.replaceState({}, ""); // Reset the history state
      }
    };
  }, [show, handleClose]);
  
  useEffect(() => {
    generateQRCode();
  }, [sellerOrderId, product]);


  // Handle the image index change every 4 seconds if product has multiple images
  useEffect(() => {
    if (product?.images?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 4000); // Change every 4 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount or product change
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!username) {
      setLoginPrompt('You have to sign in to complete the order.');
      return;
    }
    try {
      setMessage('');
      setError('');

      if (quantity < 1) {
        setError('Quantity must be at least 1');
        return;
      }
      setLoading(true);
      console.log("Selected Variations:", selectedVariant);
      const addResponse = await axiosInstance.post('/cart/cart/add', 
        { username, productId: product._id, quantity, variant: selectedVariant,  }
      );

      setMessage(addResponse.data.message);
      setTimeout(() => {
        setLoading(false);
        handleClose();
      }, 2000);
      
    } catch (err) {
      setLoading(false);
      console.error('Failed to add to cart:', err);
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleCoreSellButtonClick = () => {
    if (!username) {
      setLoginPrompt('You have to sign in to complete the order.');
      return;
    }
    setShowcore(!showcore);
    setShowMpesaInput(true); 
    setMessage('');
    setError('');
  };

  const handleCoreSell = async () => {
    const mpesaRegex = /^(2547|2541)\d{8}$/;
  
    if (!mpesaNumber) {
      setError('Please enter your MPesa number');
      return;
    }
  
    if (!mpesaRegex.test(mpesaNumber)) {
      setError('Please enter a valid MPesa number starting with 2547 or 2541 and followed by 8 digits');
      return;
    }
  
    try {
      setMessage('');
      setError('');
  
      const response = await axiosInstance.post('/coresell/initiate', {
        username,
        mpesaNumber,
        productId: product._id,
      });
  
      setMessage('Core sell completed! You can now download the product info and QR code.');
      setSellerOrderId(response.data.sellerOrderId); // Save sellerOrderId from response
      setShowQrCode(true);
      setMpesaNumber(''); // Reset MPesa number after successful sell
  
    } catch (err) {
      console.error('Failed to complete core sell:', err);
      setError(err.response?.data?.message || 'Core sell failed');
    }
  };

  const downloadProductInfo = () => {
    const dataStr = `
      Product Name: ${product.name}
      Description: ${product.description}
      Price: Ksh ${product.price}
      Category: ${product.category}
    `;
    
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.name}_info.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };



  if (!product) return null;

  // Helper function to calculate price after discount
  const calculateDiscountedPrice = (product) => {
    const discountAmount = product.discount
      ? (product.price * product.discountpersentage) / 100
      : 0;
    const discountedPrice = product.discount ? product.price - discountAmount : product.price;
    return {
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    };
  };

  const handleReviewAction = (action, data) => {
    if (action === "edit") {
      setEditingReview(data); // Pass review data to edit
    } else if (action === "delete") {
      handleDeleteReview(data); // Pass review ID to delete
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(
        `/review/delete/${reviewId}`
      );
      alert("Review deleted successfully!");
      setRefreshReviews((prev) => !prev); // Trigger refresh
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review.");
    }
  };

  const handleReviewActionComplete = () => {
    setEditingReview(null);
    setRefreshReviews((prev) => !prev); // Trigger refresh
  };

  const { discountedPrice, discountAmount } = calculateDiscountedPrice(product);

  const handleVariantChange = (type, value) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [type]: value, // Add or update the selected field
      productId: product._id, // Ensure productId is included
    }));
  };








  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      const qrCodeData = `https://baze-link.web.app/coreorder?sellerOrderId=${sellerOrderId}&productId=${product._id}`;

      // Generate QR code
      await QRCode.toCanvas(canvas, qrCodeData, {
        width: 300, // Adjust QR code size
        margin: 2,
        errorCorrectionLevel: "H",
      });

      // Draw the logo in the center
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = ico;

      img.onload = () => {
        const logoSize = canvas.width * 0.2; // Logo size is 20% of QR code width
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        // Optional: Add a white background behind the logo for better contrast
        context.fillStyle = "white";
        context.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

        // Draw the logo
        context.drawImage(img, x, y, logoSize, logoSize);
      };
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };




  
  return (
    <Modal
      className="custom-modal"
      show={show}
      onHide={() => {
        handleClose();
        setMessage('');
        setError('');
        setShowQrCode(false);
        setShowMpesaInput(false);
        setSellerOrderId('');
        setMpesaNumber('');
        setSelectedVariant({});
        setFilteredVariations(product.variations || []);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">{product.name}</Modal.Title>
      </Modal.Header>

      {!showcore ? (
        <Modal.Body>
        <div className="product-details-container">
          {/* Product Image Section */}
          <div className="product-image-container">
            {product?.images?.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={`product-image-${currentImageIndex}`}
                className="product-image"
              />
            ) : (
              <p className="no-image-text">No images available for this product.</p>
            )}
          </div>

          {/* Product Info Section */}
          <div className="product-info">
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>

            <p className="product-category">Category: {product.category}</p>
            {product.label && <span className="product-badge">{product.label}</span>}

            <div className="product-prices">
              {product.discount ? (
                <>
                  <p className="old-price">
                    <s>Ksh {product.price.toFixed(2)}</s>
                  </p>
                  <p className="new-price">Ksh {discountedPrice}</p>
                  <p className="discount-info">
                    Save Ksh {discountAmount} ({product.discountpersentage}% off)
                  </p>
                </>
              ) : (
                <p className="new-price">Ksh {product.price.toFixed(2)}</p>
              )}
            </div>

            <div className="product-features">
              {product.features && product.features.length > 0 ? (
                
                <ul>
                  <h3>Features:</h3>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <strong>{feature.type}:</strong> {feature.specification}
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </div>

            <div className="product-variations">
              {product.variations && product.variations.length > 0 ? (
                <>
                  <h3>Select Your Variations:</h3>
                  {['color', 'size', 'material', 'style'].map((field, index) => (
                    <div key={field} className="variant-selection">
                      <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <select
                        id={field}
                        name={field}
                        onChange={(e) => handleVariantChange(field, e.target.value)}
                        value={selectedVariant[field] || ''}
                        disabled={
                          index > 0 &&
                          !selectedVariant[Object.keys(selectedVariant)[index - 1]]
                        }
                      >
                        <option value="" disabled>
                          Select {field.charAt(0).toUpperCase() + field.slice(1)}
                        </option>

                        {field === 'size' ? (
                          [
                            ...new Set(filteredVariations.flatMap((variation) => variation.size)),
                          ].map((size, idx) => (
                            <option key={idx} value={size}>
                              {size}
                            </option>
                          ))
                        ) : (
                          filteredVariations
                            .map((variation) => variation[field])
                            .filter((value, i, self) => self.indexOf(value) === i)
                            .map((option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))
                        )}
                      </select>
                    </div>
                  ))}
                </>
              ) : (
                ""
              )}
            </div>



          </div>
        </div>

        {/* Review Section */}
        <ReviewList productId={product._id} onReviewAction={handleReviewAction} />
        {editingReview ? (
          <AddEditReview
            productId={product._id}
            reviewToEdit={editingReview}
            currentUser={currentUser}
            onReviewActionComplete={handleReviewActionComplete}
          />
        ) : null}

        {/* Quantity and Core Sell */}
        <div className="product-actions">
          <Form.Group controlId="productQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      ): (
        <>
          {product.price > 500 && (
          <div className="core-sell-section">

            {showMpesaInput && (
              <Form.Group controlId="mpesaNumber">
                <Form.Label>MPesa Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter MPesa number"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                />
                <Button variant="success" onClick={handleCoreSell}>
                  Confirm Core Sell
                </Button>
              </Form.Group>
            )}
            {showQrCode && sellerOrderId && (
              <div style={{ textAlign: "center" }}>
              <canvas ref={canvasRef} />
              <button
                onClick={downloadQRCode}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  background: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download QR Code
              </button>
              <ProductsDetail product={product} />
              <Productimage product={product}  />
              </div>
              

            )}
          </div>
        )}
        </>

      )}






      {loginPrompt && (
        <Alert variant="warning" className="ordcore-alert">
          {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
        </Alert>
      )}
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      <Modal.Footer>
        <Button variant="warning" onClick={handleCoreSellButtonClick}>
        {showcore ? "Back" : "Core Sell"}
          
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddToCart}>
        {loading ? "Adding..." : "Add to Cart"}
          
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

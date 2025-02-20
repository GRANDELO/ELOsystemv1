import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { Alert, Button, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';
import ReviewList from "./ReviewList";
import ProductsDetail from "./ProductsDetail";
import Productimage from "./productimage";
import AddEditReview from "./AddEditReview";
import QRCode from "qrcode";
import ico from "./images/log.png";
import './styles/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams(); // Get product id from the URL
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [errorProduct, setErrorProduct] = useState('');

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
  const [filteredVariations, setFilteredVariations] = useState([]);
  const [showCore, setShowCore] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const currentUser = getUsernameFromToken();

  // Fetch product details from /newproducts/:id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const response = await axiosInstance.get(`/newproducts/${id}`);
        setProduct(response.data);
        setFilteredVariations(response.data.variations || []);
      } catch (err) {
        setErrorProduct(err.response?.data?.message || `Failed to fetch product.${id}`);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Generate QR code whenever sellerOrderId or product changes
  useEffect(() => {
    if (product) {
      generateQRCode();
    }
  }, [sellerOrderId, product]);

  // Carousel effect for product images
  useEffect(() => {
    if (product && product.images && product.images.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 4000);
      return () => clearInterval(intervalId);
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
      const addResponse = await axiosInstance.post('/cart/cart/add', {
        username,
        productId: product._id,
        quantity,
        variant: selectedVariant,
      });
      setMessage(addResponse.data.message);
      setTimeout(() => {
        setLoading(false);
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
    setShowCore(!showCore);
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
      setSellerOrderId(response.data.sellerOrderId);
      setShowQrCode(true);
      setMpesaNumber('');
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

  const { discountedPrice, discountAmount } = product ? calculateDiscountedPrice(product) : { discountedPrice: 0, discountAmount: 0 };

  const handleVariantChange = (type, value) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [type]: value,
      productId: product._id,
    }));
  };

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      const qrCodeData = `https://baze-link.web.app/coreorder?sellerOrderId=${sellerOrderId}&productId=${product._id}`;
      await QRCode.toCanvas(canvas, qrCodeData, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = ico;
      img.onload = () => {
        const logoSize = canvas.width * 0.2;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        context.fillStyle = "white";
        context.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
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

  const handleReviewAction = (action, data) => {
    if (action === "edit") {
      setEditingReview(data);
    } else if (action === "delete") {
      handleDeleteReview(data);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/review/delete/${reviewId}`);
      alert("Review deleted successfully!");
      setRefreshReviews((prev) => !prev);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review.");
    }
  };

  const handleReviewActionComplete = () => {
    setEditingReview(null);
    setRefreshReviews((prev) => !prev);
  };

  if (loadingProduct) return <p>Loading product...</p>;
  if (errorProduct) return <p>{errorProduct}</p>;
  if (!product) return <p>No product found.</p>;

  // Add this function inside your ProductPage component
const shareProduct = () => {
  const shareData = {
    title: product.name,
    text: `Check out this product: ${product.name}`,
    url: window.location.href, // Or a custom product URL if needed
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log("Product shared successfully"))
      .catch((error) => console.error("Error sharing", error));
  } else {
    // Fallback: copy link to clipboard
    navigator.clipboard
      .writeText(shareData.url)
      .then(() => alert("Product link copied to clipboard"))
      .catch((err) => console.error("Could not copy text: ", err));
  }
};


  return (
    <div className="product-page">
      <header className="product-header">
        <h1>{product.name}</h1>
      </header>

      <section className="product-content">
      {showCore ? (
            <div className="core-sell-section">
              {showMpesaInput && (
                <Form.Group  className="mpesaNumber " controlId="mpesaNumber">
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
                <div  className= "oter-qr-code-section">
                <div className="qr-code-section" style={{ textAlign: "center" }}>
                  <canvas ref={canvasRef} />
                  <Button
                    onClick={downloadQRCode}
                    style={{ marginTop: "20px", padding: "10px 20px" }}
                  >
                    Download QR Code
                  </Button>
                  <Productimage product={product} />
                </div>
                <ProductsDetail product={product} />
                
                </div>
              )}
            </div>
          ): (
            <div className="product-details-container">
              {/* Product Image & Basic Info */}
              <div>
                {/* Product Image Section */}
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`product-image-${currentImageIndex}`}
                      className="product-image"
                    />
                  ) : (
                    <p>No images available for this product.</p>
                  )}
                </div>

                {/* Product Info Section */}
                <div className="product-info">
                  {/* Show category only if it exists */}
                  {product.category && (
                    <p className="product-category">Category: {product.category}</p>
                  )}

                  {/* Show label only if it exists */}
                  {product.label && <span className="product-badge">{product.label}</span>}

                  {/* Pricing & Discount Info */}
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
                </div>
              </div>



                <div
                className="product-description"
                >
                {/* Description (only if non-empty) */}
                {product.description && product.description.trim() !== "" && (
                <div
                  
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
              )}

              {/* Product Features (only if there's something to show) */}
              {product.features && product.features.length > 0 && (
                <div className="product-features">
                  <h3>Features:</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <strong>{feature.type}:</strong> {feature.specification}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
                </div>


              {/* Product Variations (only if they exist) */}
              {product.variations && product.variations.length > 0 && (
                <div className="product-variations">
                  <h3>Select Your Variations:</h3>
                  {["color", "size", "material", "style"].map((field, index) => (
                    <div key={field} className="variant-selection">
                      <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <select
                        id={field}
                        name={field}
                        onChange={(e) => handleVariantChange(field, e.target.value)}
                        value={selectedVariant[field] || ""}
                        disabled={
                          index > 0 &&
                          !selectedVariant[Object.keys(selectedVariant)[index - 1]]
                        }
                      >
                        <option value="" disabled>
                          Select {field.charAt(0).toUpperCase() + field.slice(1)}
                        </option>
                        {field === "size"
                          ? [
                              ...new Set(
                                filteredVariations.flatMap((variation) => variation.size)
                              ),
                            ].map((size, idx) => (
                              <option key={idx} value={size}>
                                {size}
                              </option>
                            ))
                          : filteredVariations
                              .map((variation) => variation[field])
                              .filter((value, i, self) => self.indexOf(value) === i)
                              .map((option, idx) => (
                                <option key={idx} value={option}>
                                  {option}
                                </option>
                              ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

          )}





        {/* Actions Section */}
        <section className="actions-section">

          {/* Review Section */}
          <section className="reviews-section">
            <ReviewList productId={product._id} onReviewAction={handleReviewAction} />
            {editingReview && (
              <AddEditReview
                productId={product._id}
                reviewToEdit={editingReview}
                currentUser={currentUser}
                onReviewActionComplete={handleReviewActionComplete}
              />
            )}
          </section>

          <Form.Group controlId="productQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
          </Form.Group>
          {loginPrompt && (
            <Alert variant="warning" className="login-alert">
              {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
            </Alert>
          )}
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="buttons-group">
            <Button variant="warning" onClick={handleCoreSellButtonClick}>
              {showCore ? "Back" : "Core Sell"}
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button variant="secondary" onClick={shareProduct}>
              Share Product
            </Button>

          </div>

          {/* Core Sell Section */}

        </section>
      </section>
    </div>
  );
};

export default ProductPage;

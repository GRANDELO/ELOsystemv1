import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';
import './styles/ProductModal.css';

const ProductModal = ({ product, show, handleClose }) => {
  const { dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [showMpesaInput, setShowMpesaInput] = useState(false); 
  const [showQrCode, setShowQrCode] = useState(false);
  const [sellerOrderId, setSellerOrderId] = useState(''); // New state for sellerOrderId
  const username = getUsernameFromToken();

  const handleAddToCart = async () => {
    try {
      setMessage('');
      setError('');

      if (quantity < 1) {
        setError('Quantity must be at least 1');
        return;
      }

      const addResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/cart/add', 
        { username, productId: product._id, quantity }
      );

      setMessage(addResponse.data.message);

    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleCoreSellButtonClick = () => {
    setShowMpesaInput(true); 
    setMessage('');
    setError('');
  };

  const handleCoreSell = async () => {
    if (!mpesaNumber) {
      setError('Please enter your MPesa number');
      return;
    }

    try {
      setMessage('');
      setError('');

      const response = await axios.post('https://elosystemv1.onrender.com/api/coresell/initiate', {
        username,
        mpesaNumber,
        productId: product._id,
      });

      setMessage('Core sell completed! You can now download the product info and QR code.');
      setSellerOrderId(response.data.sellerOrderId); // Save sellerOrderId from response
      setShowQrCode(true);

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

  const downloadQRCode = () => {
    const qrCodeUrl = document.getElementById('qrCode').toDataURL('image/png');
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${product.name}_QR.png`;
    link.click();
  };

  if (!product) return null;

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
        setSellerOrderId(''); // Reset sellerOrderId on close
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <img src={product.image} alt={product.name} className="product-image" />
        <p>{product.description}</p>
        <p>Ksh {product.price}</p>
        <p>{product.category}</p>

        {/* Quantity input */}
        <Form.Group controlId="productQuantity" className="mt-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
        </Form.Group>

        {/* Core Sell Button */}
        <Button variant="warning" className="mt-3" onClick={handleCoreSellButtonClick}>
          Core Sell
        </Button>

        {/* MPesa Number input for Core Sell */}
        {showMpesaInput && (
          <>
            <Form.Group controlId="mpesaNumber" className="mt-3">
              <Form.Label>MPesa Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your MPesa number"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={handleCoreSell}>
              Confirm Core Sell
            </Button>
          </>
        )}

        {showQrCode && sellerOrderId && (
          <div className="qr-section mt-4">
            <QRCodeCanvas
              id="qrCode"
              value={`https://grandelo.web.app/coreorder?sellerOrderId=${sellerOrderId}&productId=${product._id}`}
              size={150}
            />
            <Button variant="primary" className="mt-3" onClick={downloadQRCode}>
              Download QR Code
            </Button>
            <Button variant="secondary" className="mt-3" onClick={downloadProductInfo}>
              Download Product Info
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { 
          handleClose(); 
          setMessage(''); 
          setError(''); 
          setShowQrCode(false); 
          setShowMpesaInput(false); 
          setSellerOrderId(''); 
        }}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';
import './styles/ProductModal.css';

const ProductModal = ({ product, show, handleClose }) => {
  const { dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1); // State for quantity
  const username = getUsernameFromToken();

  const handleAddToCart = async () => {
    try {
      setMessage('');
      setError('');
      
      // Ensure quantity is at least 1
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

  if (!product) return null;

  return (
    <Modal 
      className="custom-modal" 
      show={show} 
      onHide={() => { handleClose(); setMessage(''); setError(''); }}
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
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />}
        
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { handleClose(); setMessage(''); setError(''); }}>
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

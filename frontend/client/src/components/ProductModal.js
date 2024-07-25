import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';

const ProductModal = ({ product, show, handleClose }) => {
  const { dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const username = getUsernameFromToken();

  const handleAddToCart = async () => {
    try {
      setMessage('');
      setError('');
      const addResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/cart/add', 
        { username, productId: product._id, quantity: 1 }
      );
      setMessage(addResponse.data.message);

    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={() => { handleClose(); setMessage(''); setError(''); }}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <p>{product.description}</p>
        <p>Ksh {product.price}</p>
        <p>{product.category}</p>
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />}
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

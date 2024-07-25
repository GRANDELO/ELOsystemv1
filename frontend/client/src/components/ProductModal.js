import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { getUsernameFromToken } from '../utils/auth';

const ProductModal = ({ product, show, handleClose }) => { // Pass username as a prop
  const { dispatch } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const username = getUsernameFromToken();

  const handleAddToCart = async () => {
    try {
      const addResponse = await axios.post('https://elosystemv1.onrender.com/api/cart/add', 
        { username, productId: product._id, quantity: 1 } // Include username in the request
      );
      setMessage(addResponse.data.message);

      const response = await axios.post('https://elosystemv1.onrender.com/api/cart', { username }); // Include username in the request
      dispatch({ type: 'SET_CART', payload: response.data.items });
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add to cart.');
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

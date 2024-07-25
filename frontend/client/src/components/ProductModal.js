import axios from 'axios';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const ProductModal = ({ product, show, handleClose }) => {
  const { dispatch } = useCart();

  const handleAddToCart = async () => {
    try {
      await axios.post('https://elosystemv1.onrender.com/api/cart/add', 
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const response = await axios.get('https://elosystemv1.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch({ type: 'SET_CART', payload: response.data.items });
      handleClose();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{product.description}</p>
        <p>Ksh {product.price}</p>
        <p>{product.category}</p>
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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

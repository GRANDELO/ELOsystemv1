import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import './styles/ProductModal.css';

const ProductModal = ({ product, show, handleClose }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatedField, setUpdatedField] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');

  const handleUpdate = async () => {
    if (!product || !updatedField || !updatedValue) {
      setError('Please fill in all fields to update.');
      return;
    }

    // Basic validation for price to ensure it is a number
    if (updatedField === 'price' && isNaN(updatedValue)) {
      setError('Price must be a number.');
      return;
    }

    try {
      // Sending the updated field and value to the backend
      const response = await axios.patch(`https://elosystemv1.onrender.com/api/products/${product._id}`, {
        field: updatedField,  // Sending field name
        value: updatedValue,  // Sending new value
      });

      setMessage(response.data.message);
      setUpdatedField('');
      setUpdatedValue('');
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://elosystemv1.onrender.com/api/products/${product._id}`);
      setMessage('Product deleted successfully.');
      handleClose(); // Close the modal after deletion
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError(err.response?.data?.message || 'Failed to delete product');
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

        {/* Update Field Selection */}
        <Form.Group className="mt-3">
          <Form.Label>Field to Update</Form.Label>
          <Form.Select
            value={updatedField}
            onChange={(e) => setUpdatedField(e.target.value)}
          >
            <option value="">Select field to update</option>
            <option value="name">Name</option>
            <option value="description">Description</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
          </Form.Select>
          <Form.Label className="mt-2">New Value</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new value"
            value={updatedValue}
            onChange={(e) => setUpdatedValue(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Delete Product
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update Product
        </Button>
        <Button variant="secondary" onClick={() => { handleClose(); setMessage(''); setError(''); }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

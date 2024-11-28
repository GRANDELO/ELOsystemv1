import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import './styles/ProductModal.css';

const ProductModal = ({ product, show, handleClose }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatedField, setUpdatedField] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to update the image index periodically
  useEffect(() => {
    if (product?.images?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 4000); // Change every 4 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount or product change
    }
  }, [product]);

  const handleUpdate = async () => {
    if (!product || !updatedField || !updatedValue) {
      setError('Please fill in all fields to update.');
      return;
    }

    // Basic validation for specific fields
    if (updatedField === 'price' && isNaN(updatedValue)) {
      setError('Price must be a number.');
      return;
    }
    if (updatedField === 'discountPercentage' && (isNaN(updatedValue) || updatedValue < 0 || updatedValue > 100)) {
      setError('Discount percentage must be a number between 0 and 100.');
      return;
    }

    try {
      // Sending the updated field and value to the backend
      const response = await axios.patch(`https://elosystemv1.onrender.com/api/products/${product._id}`, {
        field: updatedField,
        value: updatedValue,
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
      onHide={() => {
        handleClose();
        setMessage('');
        setError('');
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Display product images */}
        <div className="product-images">
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

        <p>{product.description}</p>
        <p>Ksh {product.price}</p>
        <p>{product.category}</p>

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
            <option value="discount">Discount</option>
            <option value="discountPercentage">Discount Percentage</option>
            <option value="label">Label</option>
          </Form.Select>
          <Form.Label className="mt-2">New Value</Form.Label>
          {/* Conditional Input Field Rendering */}
          {updatedField === 'discount' ? (
            <Form.Select
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            >
              <option value="">Select discount option</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Form.Select>
          ) : updatedField === 'label' ? (
            <Form.Select
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            >
              <option value="">Select label</option>
              <option value="clearance">Clearance</option>
              <option value="discount">Discount</option>
              <option value="new arrival">New Arrival</option>
            </Form.Select>
          ) : updatedField === 'discountPercentage' ? (
            <Form.Control
              type="number"
              placeholder="Enter discount percentage"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
              min="0"
              max="100"
            />
          ) : (
            <Form.Control
              type="text"
              placeholder="Enter new value"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            />
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Delete Product
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update Product
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            setMessage('');
            setError('');
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

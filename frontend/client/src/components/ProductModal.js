import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ProductModal = ({ product, show, handleClose }) => {
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
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

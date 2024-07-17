import axios from 'axios';
import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/products', formData);
      setMessage('Product successfully added!');
    } catch (error) {
      setMessage('Error adding product');
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          placeholder="Enter product price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <input
          type="text"
          name="category"
          placeholder="Enter product category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          placeholder="Enter image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductForm;

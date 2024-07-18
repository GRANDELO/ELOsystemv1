// src/components/ProductForm.js
import axios from 'axios';
import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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

        <label>Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
        />

        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductForm;

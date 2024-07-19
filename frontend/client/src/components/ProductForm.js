
// src/components/ProductForm.js
import axios from 'axios';
import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('image', formData.image);

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/products', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product uploaded successfully');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" onChange={handleChange} required />
      </label>
      <label>
        Description:
        <input type="text" name="description" onChange={handleChange} required />
      </label>
      <label>
        Price:
        <input type="number" name="price" onChange={handleChange} required />
      </label>
      <label>
      category:
        <input type="text" name="category" onChange={handleChange} required />
      </label>
      <label>
        Image:
        <input type="file" name="image" onChange={handleChange} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;

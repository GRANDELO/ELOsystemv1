// src/components/ProductForm.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/products/${id}`);
        const product = response.data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        }); // Populates the form with current product data
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);


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
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = id
      ? await axios.put(`https://elosystemv1.onrender.com/api/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }) // Update existing product
      : await axios.post(`https://elosystemv1.onrender.com/api/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }); // Create new product
      alert('Product uploaded successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product:' + error.response?.data.message || 'Unknown error');
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
      {formData.imageUrl && (
        <div>
          <img src={`https://elosystemv1.onrender.com${formData.imageUrl}`} alt="Product" style={{ width: '200px' }} />
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;

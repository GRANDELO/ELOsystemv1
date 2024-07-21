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
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://elosystemv1.onrender.com/api/products/${id}`);
          setFormData(response.data.product);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
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
      if (id) {
        // Update existing product
        await axios.put(`https://elosystemv1.onrender.com/api/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully');
      } else {
        // Create new product
        await axios.post(`https://elosystemv1.onrender.com/api/products`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product created successfully');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error uploading product:', error.message); // Log detailed error
      alert(`Error uploading product: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
      </label>
      <label>
        Price:
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>
      <label>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      </label>
      <label>
        Image:
        <input type="file" name="image" onChange={handleChange} />
      </label>
      <button type="submit">{id ? 'Update' : 'Create'} Product</button>
    </form>
  );
};

export default ProductForm;

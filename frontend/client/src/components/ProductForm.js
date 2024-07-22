import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductForm.css';
import axiosInstance from './axiosInstance';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axiosInstance.get(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    console.log('File dropped:', e.dataTransfer.files);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
    console.log('Dragging over');
  };

  const handleDragLeave = () => {
    setDragging(false);
    console.log('Drag left');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
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
        await axiosInstance.put(`/products/${id}`, formDataToSend, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Product updated successfully');
      } else {
        // Create new product
        await axiosInstance.post(`/products`, formDataToSend, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Product created successfully');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error uploading product:', error.message);
      setMessage(`Error uploading product: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Product deleted successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error deleting product:', error.message);
      setMessage(`Error deleting product: ${error.message}`);
    }
  };

  return (
    <div className="product-form-container">
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
          <input
            type="file"
            name="image"
            onChange={handleChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {formData.image ? formData.image.name : 'Drag and drop an image or click to select'}
          </div>
        </label>
        <button type="submit">{id ? 'Update' : 'Create'} Product</button>
        {id && (
          <button type="button" onClick={handleDelete}>Delete Product</button>
        )}
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductForm;

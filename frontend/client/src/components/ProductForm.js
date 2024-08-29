import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './styles/ProductForm.css';
import ProductList from './ProductsList';
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
          const token = sessionStorage.getItem('userToken');
          const response = await axiosInstance.get(`/products/products/${id}`, {
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevents the second click
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('userToken');
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
        await axiosInstance.put(`products/products/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Product updated successfully');
      } else {
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
    const token = sessionStorage.getItem('userToken');
    try {
      await axiosInstance.delete(`/products/products/${id}`, {
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
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            cols="50"
            placeholder="Enter the description here..."
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <select id="category" name="category" value={formData.category} onChange={handleChange} required >
            {/* Category options */}
            <optgroup label="Electronics">
              <option value="mobile-phones">Mobile Phones</option>
              <option value="computers">Computers</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="audio-video">Audio & Video</option>
              <option value="wearable-technology">Wearable Technology</option>
            </optgroup>
            <optgroup label="Fashion">
              <option value="mens-clothing">Men's Clothing</option>
              <option value="womens-clothing">Women's Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
              <option value="jewelry">Jewelry</option>
            </optgroup>
            <optgroup label="Home & Kitchen">
              <option value="furniture">Furniture</option>
              <option value="kitchenware">Kitchenware</option>
              <option value="home-decor">Home Decor</option>
              <option value="bedding">Bedding</option>
            </optgroup>
            <optgroup label="Books & Media">
              <option value="books">Books</option>
              <option value="movies-tv">Movies & TV</option>
              <option value="music">Music</option>
              <option value="video-games">Video Games</option>
            </optgroup>
            <optgroup label="Toys & Games">
              <option value="action-figures">Action Figures</option>
              <option value="educational-toys">Educational Toys</option>
              <option value="board-games">Board Games</option>
              <option value="puzzles">Puzzles</option>
              <option value="outdoor-toys">Outdoor Toys</option>
            </optgroup>
            <optgroup label="Sports & Outdoors">
              <option value="fitness-equipment">Fitness Equipment</option>
              <option value="outdoor-gear">Outdoor Gear</option>
              <option value="sportswear">Sportswear</option>
              <option value="cycling">Cycling</option>
            </optgroup>
            <optgroup label="Beauty & Personal Care">
              <option value="skincare">Skincare</option>
              <option value="haircare">Haircare</option>
              <option value="makeup">Makeup</option>
              <option value="personal-hygiene">Personal Hygiene</option>
            </optgroup>
            <optgroup label="Automotive">
              <option value="car-parts">Car Parts</option>
              <option value="accessories">Accessories</option>
              <option value="tools-equipment">Tools & Equipment</option>
              <option value="maintenance-care">Maintenance & Care</option>
            </optgroup>
            <optgroup label="Health">
              <option value="medical-supplies">Medical Supplies</option>
              <option value="wellness">Wellness</option>
              <option value="personal-care">Personal Care</option>
            </optgroup>
            <optgroup label="Grocery">
              <option value="fresh-produce">Fresh Produce</option>
              <option value="packaged-foods">Packaged Foods</option>
              <option value="dairy-products">Dairy Products</option>
              <option value="bakery">Bakery</option>
            </optgroup>
            <optgroup label="Office Supplies">
              <option value="stationery">Stationery</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
            </optgroup>
            <optgroup label="Arts & Crafts">
              <option value="painting-supplies">Painting Supplies</option>
              <option value="craft-materials">Craft Materials</option>
              <option value="sewing-knitting">Sewing & Knitting</option>
            </optgroup>
          </select>
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
            onClick={handleClick}
          >
            {formData.image ? formData.image.name : 'Drag and drop an image or click to select'}
          </div>
        </label>
        <button type="submit">{id ? 'Update' : 'Submit'}</button>
        {id && <button type="button" onClick={handleDelete}>Delete</button>}
        {message && <p>{message}</p>}
      </form>
      <div>
        < ProductList/>
      </div>
    </div>
  );
};

export default ProductForm;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NewProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    description: '',
    username: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchNewProduct = async () => {
      try {
        const res = await axios.get(`https://elosystemv1.onrender.com/api/newproducts/${id}`);
        setNewProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNewProduct();
  }, [id]);

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://elosystemv1.onrender.com/api/newproducts/${id}`, newProduct);
      console.log('NewProduct updated:', res.data);
      navigate(`/newproducts/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
      <input type="text" name="category" value={newProduct.category} onChange={handleChange} />
      <input type="text" name="subCategory" value={newProduct.subCategory} onChange={handleChange} />
      <input type="number" name="price" value={newProduct.price} onChange={handleChange} />
      <textarea name="description" value={newProduct.description} onChange={handleChange}></textarea>
      <input type="text" name="username" value={newProduct.username} onChange={handleChange} />
      <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} />
      <button type="submit">Update NewProduct</button>
    </form>
  );
};

export default NewProductEdit;

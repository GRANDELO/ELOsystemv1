import axios from 'axios';
import React, { useState } from 'react';

const NewProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    description: '',
    username: '',
    quantity: '',
  });

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://elosystemv1.onrender.com/api/newproducts', newProduct);
      console.log('NewProduct created:', res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="text" name="category" placeholder="Category" onChange={handleChange} />
      <input type="text" name="subCategory" placeholder="Sub Category" onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} />
      <button type="submit">Create NewProduct</button>
    </form>
  );
};

export default NewProductForm;

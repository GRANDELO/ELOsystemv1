import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const NewProductDetail = () => {
  const { id } = useParams();
  const [newProduct, setNewProduct] = useState(null);

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

  if (!newProduct) return <div>Loading...</div>;

  return (
    <div>
      <h1>{newProduct.name}</h1>
      <p>{newProduct.category} - {newProduct.subCategory}</p>
      <p>{newProduct.price}</p>
      <p>{newProduct.description}</p>
      <p>Created by: {newProduct.username}</p>
      <p>Quantity: {newProduct.quantity}</p>
      <Link to={`/newproducts/${id}/edit`}>Edit</Link>
    </div>
  );
};

export default NewProductDetail;

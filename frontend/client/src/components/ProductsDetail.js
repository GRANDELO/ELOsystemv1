// src/components/ProductsDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const ProductsDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);  // Logs detailed error to console
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching product: {error}</div>;

  return (
    <div>
      {product ? (
        <>
          <h1>{product.name}</h1>
          <img src={product.image} alt={product.name} width="200" />
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          <p>Price: {product.price}</p>
        </>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductsDetail;

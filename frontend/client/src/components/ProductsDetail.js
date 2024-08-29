import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const ProductsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // To navigate back or to other pages
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error('Error Response:', err.response);
        setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred'}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('Error Request:', err.request);
        setError('No response received from the server.');
      } else {
        // Something happened in setting up the request
        console.error('Error Message:', err.message);
        setError(err.message);
      }
      setLoading(false);
    }
  };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    };
    
    // Save to local storage or a global cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Product added to cart!');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching product: {error}</div>;

  return (
    <div className="product-detail">
      {product ? (
        <>
          <h1>{product.name}</h1>
          <img src={product.image} alt={product.name} width="300" />
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          <p>Price: ${product.price}</p>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input 
              type="number" 
              id="quantity" 
              value={quantity} 
              min="1" 
              onChange={(e) => setQuantity(e.target.value)} 
            />
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-button">
            Add to Cart
          </button>
          
          <button onClick={() => navigate(-1)} className="go-back-button">
            Go Back
          </button>
        </>
      ) : (
        <>
          <p>Product not found.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </>
      )}
    </div>
  );
};

export default ProductsDetail;

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UnpackedProducts = () => {
  const [unpackedProducts, setUnpackedProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch unpacked products on component mount
    const fetchUnpackedProducts = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/orders/unpackedproducts'); // Adjust the URL based on your backend
        setUnpackedProducts(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUnpackedProducts();
  }, []);

  const handleMarkAsPacked = async (orderId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/orders/${orderId}/packed`); // Adjust the URL based on your backend
      // Remove the packed product from the state
      setUnpackedProducts((prev) => prev.filter(product => product.orderId !== orderId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Unpacked Products</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {unpackedProducts.length === 0 ? (
        <p>No unpacked products available.</p>
      ) : (
        <ul>
          {unpackedProducts.map(({ orderId, products }) => (
            <li key={orderId}>
              <h2>Order ID: {orderId}</h2>
              <ul>
                {products.map(product => (
                  <li key={product.productId}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>Category: {product.category}</p>
                      <p>Price: ${product.price}</p>
                      <p>Quantity: {product.quantity}</p>
                      {product.image && <img src={product.image} alt={product.name} style={{ width: '100px' }} />}
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleMarkAsPacked(orderId)}>Mark as Packed</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnpackedProducts;

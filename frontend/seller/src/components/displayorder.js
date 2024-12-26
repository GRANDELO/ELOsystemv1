import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from '../utils/auth';

const PendingOrders = () => {
  const username = getUsernameFromToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/orders/mypending/${username}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [username]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No pending orders found.</p>;
  }

  return (
    <div>
      <h1>Pending Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId} className="order">
          <h2>Order ID: {order.orderId}</h2>
          <div className="products">
            {order.products.map((product, index) => (
              <div key={index} className="product">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Variance: {product.variance || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingOrders;

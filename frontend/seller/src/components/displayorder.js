import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from "../utils/auth";

const MyPendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const username = getUsernameFromToken(); 
  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with actual username or token logic
        const response = await axios.get(
          `https://elosystemv1.onrender.com/api/orders/mypending/${username}`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
        setError("Failed to fetch pending orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading pending orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No pending orders found.</p>;
  }

  return (
    <div className="orders-container">
      <h1>Pending Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId} className="order">
          <h2>Order ID: {order.orderId}</h2>
          <p>Destination: {order.destination}</p>
          <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
          <p>Total Price: KES {order.totalPrice.toLocaleString()}</p>
          <div className="products">
            {order.products.map((product, index) => (
              <div key={index} className="product">
                <img
                  src={product.image[0]} // Assuming the first image is displayed
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: KES {product.price.toLocaleString()}</p>
                <p>Quantity: {product.quantity.$numberInt || product.quantity}</p>
                {product.variations && (
                  <div className="variations">
                    <h4>Variations:</h4>
                    <ul>
                      <li>Color: {product.variations.color || "N/A"}</li>
                      <li>Size: {product.variations.size || "N/A"}</li>
                      <li>Material: {product.variations.material || "N/A"}</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPendingOrders;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from "../utils/auth";
import './styles/orderdisp.css';

const PendingOrders = () => {
  const username = getUsernameFromToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // To track the slideshow state per product

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://elosystemv1.onrender.com/api/orders/mypending/${username}`
        );
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

  useEffect(() => {
    // Automatically cycle through images for each product every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const updatedIndex = { ...prev };
        orders.forEach((order) => {
          order.products.forEach((product) => {
            const productId = product._id;
            const imageCount = product.image.length;
            if (imageCount > 1) {
              updatedIndex[productId] =
                (updatedIndex[productId] + 1 || 1) % imageCount;
            }
          });
        });
        return updatedIndex;
      });
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [orders]);

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
    <div className="divmain">
      <h1>Pending Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId} className="order">
          <h2>Order ID: {order.orderId}</h2>
          <div className="products">
            {order.products.map((product) => (
              <div key={product._id} className="product">
                <div className="product-image">
                  {product.image.length > 0 && (
                    <img
                      src={
                        product.image[currentImageIndex[product._id] || 0]
                      }
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: KES {product.price.toLocaleString()}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>
                    Variance:
                    {product.variance && product.variance.length > 0 ? (
                      <ul>
                        {product.variance.map((variation, index) => (
                          <li key={index}>
                            {variation.color && `Color: ${variation.color}`}
                            {variation.size &&
                              variation.size.length > 0 &&
                              `, Size: ${variation.size.join(", ")}`}
                            {variation.material &&
                              `, Material: ${variation.material}`}
                            {variation.model && `, Model: ${variation.model}`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      " N/A"
                    )}
                  </p>
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

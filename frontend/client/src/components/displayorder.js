// OrdersPage.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import './OrdersPage.css'; // Import your CSS styles

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const username = 'Teekay'; // Replace with actual username logic
      const response = await axios.get(`https://elosystemv1.onrender.com/api/orders/my/${username}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder === order ? null : order);
  };

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <div onClick={() => handleOrderClick(order)} className="order-summary">
                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Status: {order.isDelivered ? 'Delivered' : order.isDeliveryInProcess ? 'In Process' : 'Pending'}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
              </div>
              {selectedOrder === order && (
                <div className="order-details">
                  <h3>Order Details</h3>
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - ${product.price} x {product.quantity}
                      </li>
                    ))}
                  </ul>
                  <button className="action-button">View More Details</button>
                  <button className="action-button">Cancel Order</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;

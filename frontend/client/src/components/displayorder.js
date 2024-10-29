import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/displayorder.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const username = 'Teekay'; // Replace with actual username logic
      const response = await axios.get(`https://elosystemv1.onrender.com/api/orders/my/${username}`);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder === order ? null : order);
    setMessage('');
    setMpesaPhoneNumber('');
  };

  const handleMpesaPhoneNumberChange = (e) => {
    setMpesaPhoneNumber(e.target.value);
  };

  const initiatePayment = async (inorderid) => {
    if (!selectedOrder) return;
    const payload = {
      phone: mpesaPhoneNumber,
      amount: selectedOrder.totalPrice.toFixed(0),
      orderid: inorderid,
    };

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/mpesa/lipa', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage('Payment initiated successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
      console.error('Error:', error);
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      const response = await axios.patch(`https://elosystemv1.onrender.com/api/order2/${orderId}/deliverypatcher`, {
        isDelivered: true,
      });
      setMessage('Delivery confirmed successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Delivery confirmation failed: ' + (error.response ? error.response.data.message : error.message));
      console.error('Error:', error);
    }
  };

  return (
    <div className="dsord-orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="dsord-orders-list">
          {orders.map((order) => (
            <li key={order._id} className="dsord-order-item">
              <div onClick={() => handleOrderClick(order)} className="dsord-order-summary">
                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Status: {order.isDelivered ? 'Delivered' : order.isDeliveryInProcess ? 'In Process' : 'Pending'}</p>
                <p>Total: ${order.totalPrice?.toFixed(2) ?? 'N/A'}</p>
              </div>
              {selectedOrder === order && (
                <div className="dsord-order-details">
                  {!order.paid ? (
                    <div className="dsord-payment-section">
                      <label>M-Pesa Phone Number</label>
                      <input
                        type="text"
                        value={mpesaPhoneNumber}
                        onChange={handleMpesaPhoneNumberChange}
                        placeholder="2547XXXXXXXX"
                      />
                      <button 
                        onClick={() => initiatePayment(order.orderNumber)} 
                        className="dsord-action-button"
                      >
                        Pay Now
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => confirmDelivery(order.orderNumber)} 
                      className="dsord-action-button"
                    >
                      Confirm Delivery
                    </button>
                  )}
                  
                  {message && <p className="dsord-message">{message}</p>}
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

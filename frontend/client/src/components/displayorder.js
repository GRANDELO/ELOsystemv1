import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
      
      // Ensure that response.data is an array
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder === order ? null : order);
    setMessage(''); // Clear any previous messages
    setMpesaPhoneNumber(''); // Reset phone number input when switching orders
  };

  const handleMpesaPhoneNumberChange = (e) => {
    setMpesaPhoneNumber(e.target.value);
  };

  const initiatePayment = async () => {
    if (!selectedOrder) return;
    const payload = {
      phone: mpesaPhoneNumber,
      amount: selectedOrder.totalPrice.toFixed(0),
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
        await axios.patch(`https://elosystemv1.onrender.com/api/order2/${orderId}/deliverypatcher`, {
            isDelivered: true,
          });
        setMessage('Payment initiated successfully!');
        console.log(response.data);
      } catch (error) {
        setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
        console.error('Error:', error);
      }
    
    setMessage('Delivery confirmed!');

    // Implement delivery confirmation logic here
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
                <p>Total: ${order.totalPrice?.toFixed(2) ?? 'N/A'}</p>
              </div>
              {selectedOrder === order && (
                <div className="order-details">
                  <h3>Order Details</h3>
                  <ul>
                    {order.products?.map((product, index) => (
                      <li key={index}>
                        {product.name} - ${product.price} x {product.quantity}
                      </li>
                    )) ?? <li>No products available</li>}
                  </ul>

                  {/* Payment Section */}
                  {!order.paid ? (
                    <div className="payment-section">
                      <label>M-Pesa Phone Number</label>
                      <input
                        type="text"
                        value={mpesaPhoneNumber}
                        onChange={handleMpesaPhoneNumberChange}
                        placeholder="2547XXXXXXXX"
                      />
                      <button onClick={initiatePayment} className="action-button">Pay Now</button>
                    </div>
                  ) : (
                    <button onClick={confirmDelivery(order.orderNumber)} className="action-button">Confirm Delivery</button>
                  )}
                  
                  {message && <p>{message}</p>}
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

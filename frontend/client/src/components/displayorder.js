import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utils/auth';
import './styles/displayorder.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showDelivered, setShowDelivered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveredCurrentPage, setDeliveredCurrentPage] = useState(1);

  const username = getUsernameFromToken();
  const ordersPerPage = 6;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    const filtered = sortedOrders.filter(order => showDelivered ? order.isDelivered : !order.isDelivered);
    setFilteredOrders(filtered);
  }, [orders, showDelivered, currentPage, deliveredCurrentPage]);

  const fetchOrders = async () => {
    try {
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
      const response = await axios.post(`https://elosystemv1.onrender.com/api/order2/${orderId}/deliverypatcher`);
      setMessage('Delivery confirmed successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Delivery confirmation failed: ' + (error.response ? error.response.data.message : error.message));
      console.error('Error:', error);
    }
  };

  // Pagination
  const indexOfLastOrder = (showDelivered ? deliveredCurrentPage : currentPage) * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page) => {
    if (showDelivered) setDeliveredCurrentPage(page);
    else setCurrentPage(page);
  };

  return (
    <div className="dsord-orders-page">
      <h1>My Orders</h1>
      
      {/* Toggle Delivered Section */}
      <button onClick={() => {
        setShowDelivered(!showDelivered);
        setCurrentPage(1);
        setDeliveredCurrentPage(1);
      }}>
        {showDelivered ? 'Show Pending Orders' : 'Show Delivered Orders'}
      </button>
      
      {currentOrders.length === 0 ? (
        <p>No {showDelivered ? 'delivered' : 'pending'} orders found.</p>
      ) : (
        <ul className="dsord-orders-list">
          {currentOrders.map((order) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="dsord-pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={index + 1 === (showDelivered ? deliveredCurrentPage : currentPage) ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

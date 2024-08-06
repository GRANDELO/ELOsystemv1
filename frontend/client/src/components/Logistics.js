// In src/pages/LogisticsPage.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';

const LogisticsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/orders/logistics');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="logistics-page">
      <h1>Logistics</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Username</th>
            <th>Total Price</th>
            <th>Payment Method</th>
            <th>Destination</th>
            <th>Order Date</th>
            <th>Delivery Person</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.username}</td>
                <td>Ksh {order.totalPrice.toFixed(2)}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.destination}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.deliveryPerson ? order.deliveryPerson.name : 'Unassigned'}</td>
                <td>{order.isDelivered ? 'Delivered' : 'In Process'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default LogisticsPage;

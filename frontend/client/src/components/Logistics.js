// In src/pages/LogisticsPage.js

import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';

const LogisticsPage = () => {
  const [eid, setEid] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async (deliveryEid) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://elosystemv1.onrender.com/api/orders/${deliveryEid}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId) => {
    try {
      // Send request to update the order status
      const response = await axios.patch(`https://elosystemv1.onrender.com/api/orders/${orderId}/status`, {
        isDeliveryInProcess: true,
      });

      // Update order status in the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isDeliveryInProcess: true } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (eid) {
      fetchOrders(eid);
    } else {
      setError('Please enter a valid EID');
    }
  };

  return (
    <div className="logistics-page">
      <h1>Logistics</h1>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group controlId="formEID">
          <Form.Label>Enter Delivery Person EID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter EID"
            value={eid}
            onChange={(e) => setEid(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && orders.length > 0 && (
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
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.username}</td>
                <td>Ksh {order.totalPrice.toFixed(2)}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.destination}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  {order.deliveryPerson
                    ? `${order.deliveryPerson.firstName} ${order.deliveryPerson.surname}`
                    : 'Unassigned'}
                </td>
                <td>
                  {order.isDelivered ? (
                    'Delivered'
                  ) : order.isDeliveryInProcess ? (
                    'In Process'
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => updateOrderStatus(order._id)}
                    >
                      Mark as In Process
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && orders.length === 0 && !error && <p>No orders found for this delivery person.</p>}
    </div>
  );
};

export default LogisticsPage;

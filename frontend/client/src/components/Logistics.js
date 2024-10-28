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

  const handleSearch = (e) => {
    e.preventDefault();
    if (eid) {
      fetchOrders(eid); // Fetch orders for the specified delivery person
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
                <td>{order.isDelivered ? 'Delivered' : 'In Process'}</td>
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

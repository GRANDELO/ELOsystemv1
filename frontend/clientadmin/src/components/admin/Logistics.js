import axiosInstance from '../axiosInstance';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Setting from './settings';
import './styles/LogisticsPage.css';

const LogisticsPage = () => {
  const eid = sessionStorage.getItem('eid'); // Retrieve the EID from session storage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admnLogout');
  };

  // Fetch orders for the specific delivery person
  const fetchOrders = async (deliveryEid) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/orders/${deliveryEid}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Update the status of the order to 'In Process'
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
        isDeliveryInProcess: true,
      });

      // Update the order's status in the local state
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

  // Handle the form submission to search orders by EID
  const handleSearch = (e) => {
    e.preventDefault();
    if (eid) {
      fetchOrders(eid);
    } else {
      setError('Please enter a valid EID');
    }
  };

  // Fetch orders when the component mounts, if EID is available in session storage
  useEffect(() => {
    if (eid) {
      fetchOrders(eid);
    }
  }, [eid]);

  return (
    <div className="looog-logistics-page">
      <Setting />
      <h1 className="looog-page-title">Logistics</h1>

      {loading && <p className="looog-loading-text">Loading...</p>}
      {error && <Alert variant="danger" className="looog-error-alert">{error}</Alert>}

      {!loading && orders.length > 0 && (
        <Table striped bordered hover className="looog-orders-table">
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
                      className="looog-mark-in-process-btn"
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

      {!loading && orders.length === 0 && !error && (
        <p className="looog-no-orders-text">No orders found for this delivery person.</p>
      )}
      <Footer/>
    </div>
  );
};

export default LogisticsPage;

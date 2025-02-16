// components/RouteOrderDashboard.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { FaList, FaTimesCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/routes.css';

const RouteOrderDashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all routes
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/routes');
      setRoutes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setMessage('Failed to fetch routes.');
      setLoading(false);
    }
  };

  // Update route status
  const updateRouteStatus = async (routeId, status) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/admin/routes/${routeId}`, { status });
      setMessage('Route status updated successfully!');
      fetchRoutes(); // Refresh the list
      setLoading(false);
    } catch (error) {
      console.error('Error updating route status:', error);
      setMessage('Failed to update route status.');
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/admin/orders/${orderId}`, { status });
      setMessage('Order status updated successfully!');
      fetchRoutes(); // Refresh the list
      setLoading(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage('Failed to update order status.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="dashboard">
      <h2>
        <FaList /> Route and Order Management
      </h2>
      {loading && <p>Loading...</p>}
      {message && <p className="message">{message}</p>}
      <div className="routes-list">
        {routes.map((route) => (
          <div key={route._id} className="route-card">
            <h3>Route ID: {route.routeId}</h3>
            <p>Status: {route.status}</p>
            <p>Orders: {route.orders.length}</p>
            <div className="actions">
              <button onClick={() => updateRouteStatus(route._id, 'completed')}>
                <FaCheckCircle /> Mark as Completed
              </button>
              <button onClick={() => updateRouteStatus(route._id, 'delayed')}>
                <FaClock /> Mark as Delayed
              </button>
            </div>
            <div className="orders-list">
              {route.orders.map((order) => (
                <div key={order._id} className="order-card">
                  <p>Order ID: {order.orderNumber}</p>
                  <p>Status: {order.status}</p>
                  <button onClick={() => updateOrderStatus(order._id, 'cancelled')}>
                    <FaTimesCircle /> Cancel Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteOrderDashboard;
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { FaList, FaTimesCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/routes.css';

const RouteOrderDashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/routes');
      setRoutes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setMessage('Failed to fetch routes.');
      setLoading(false);
    }
  };

  const updateRouteStatus = async (routeId, status) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/routes/${routeId}`, { status });
      setMessage('Route status updated successfully!');
      fetchRoutes();
      setLoading(false);
    } catch (error) {
      console.error('Error updating route status:', error);
      setMessage('Failed to update route status.');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/orders/${orderId}`, { status });
      setMessage('Order status updated successfully!');
      fetchRoutes();
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

      <table className="routes-table">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Status</th>
            <th>Total Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <React.Fragment key={route._id}>
              <tr>
                <td>{route.routeId}</td>
                <td>{route.status}</td>
                <td>{route.orders ? route.orders.length : 0}</td>
                <td>
                  <button onClick={() => updateRouteStatus(route._id, 'completed')}>
                    <FaCheckCircle /> Complete
                  </button>
                  <button onClick={() => updateRouteStatus(route._id, 'delayed')}>
                    <FaClock /> Delay
                  </button>
                </td>
              </tr>
              {route.orders &&
                Array.isArray(route.orders) &&
                route.orders.map((order) => (
                  <tr key={order._id} className="order-row">
                    <td colSpan="2">Order ID: {order.orderNumber}</td>
                    <td>{order.status}</td>
                    <td>
                      <button onClick={() => updateOrderStatus(order._id, 'cancelled')}>
                        <FaTimesCircle /> Cancel Order
                      </button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteOrderDashboard;

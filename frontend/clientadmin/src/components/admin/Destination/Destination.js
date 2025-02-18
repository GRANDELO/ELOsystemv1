import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
import AdminPanel from './admin';
import RouteOrderDashboard from './routesOrder';
import '../styles/table.css';

const socket = io('https://elosystemv1.onrender.com/api');

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [statuses, setStatuses] = useState(
    destinations.map((destination) => destination.status || "Pending")
  );
  const [showRouteDashboard, setShowRouteDashboard] = useState(false);

  const fetchDestinations = async () => {
    try {
      const response = await axiosInstance.post('/plan-delivery');
      console.log('Backend Response:', response.data.data);
      const { directRoutes = [], hubRoutes = [] } = response.data.data;

      const processRoutes = (routes, type) =>
        routes.map((route) => ({
          type,
          origin: route.origin,
          destination: route.destination,
          orderCount: route.orderNumber ? route.orderNumber.length : 0,
          status: route.status || 'pending',
          orders: route.orderNumber
            ? route.orderNumber.map((orderNumber) => ({
                id: orderNumber,
                orderNumber,
                status: route.status || 'pending',
              }))
            : [],
        }));

      const directDestinations = processRoutes(directRoutes, 'Direct');
      const hubDestinations = processRoutes(hubRoutes, 'Hub');

      setDestinations([...directDestinations, ...hubDestinations]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();

    // Socket listener for real-time updates
    socket.on('updateDestinations', ({ directRoutes, hubRoutes }) => {
      console.log('Received from socket:', { directRoutes, hubRoutes });

      const processRoutes = (routes, type) =>
        routes.map((route) => ({
          type,
          origin: route.origin,
          destination: route.destination,
          orderCount: route.orderNumber ? route.orderNumber.length : 0,
          status: route.status || 'pending',
          orders: route.orderNumber
            ? route.orderNumber.map((orderNumber) => ({
                id: orderNumber,
                orderNumber,
                status: route.status || 'pending',
              }))
            : [],
        }));

      const directDestinations = processRoutes(directRoutes, 'Direct');
      const hubDestinations = processRoutes(hubRoutes, 'Hub');

      setDestinations([...directDestinations, ...hubDestinations]);
    });

    // Cleanup socket listener on unmount
    return () => {
      socket.off('updateDestinations');
    };
  }, []);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);
  };

  if (loading) {
    return (
      <div className="spinner-container">
      <FaSpinner className="spinner" />
    </div>
    );
  }

  return (
    <div className="container">
  <h1 className="header">
    <FaTruck /> Delivery Destinations
  </h1>
  <div className="admin-section">
          {/* Button for AdminPanel */}
          <button
            className="toggle-admin-dashboard"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
          </button>

          {/* Button for RouteOrderDashboard */}
          <button
            className="toggle-admin-dashboard"
            onClick={() => setShowRouteDashboard(!showRouteDashboard)}
          >
            {showRouteDashboard ? 'Hide Route Dashboard' : 'Show Route Dashboard'}
          </button>

          {/* Render AdminPanel if toggled */}
          {showAdminPanel && <AdminPanel />}

          {/* Render RouteOrderDashboard if toggled */}
          {showRouteDashboard && <RouteOrderDashboard />}
        </div>
 
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Route Type</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Orders</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {destinations.map((destination, index) => (
          <React.Fragment key={index}>
            <tr onClick={() => toggleRow(index)}>
              <td>{destination.type}</td>
              <td>{`${destination.origin.area}, ${destination.origin.town}, ${destination.origin.county}`}</td>
              <td>{`${destination.destination.area}, ${destination.destination.town}, ${destination.destination.county}`}</td>
              <td>{destination.orderCount}</td>
              <td>
                    <select
                      value={statuses[index]}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className={`status-dropdown ${
                        statuses[index] === "Delivered"
                          ? "status-delivered"
                          : statuses[index] === "Scheduled"
                          ? "status-scheduled"
                          : "status-pending"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
              <td>{expandedRow === index ? <FaChevronUp /> : <FaChevronDown />}</td>
            </tr>
            {expandedRow === index && (
              <tr className="expanded-row">
                <td colSpan="5">
                  <div className="expanded-content">
                    <h3>Orders</h3>
                    <ul>
                      {destination.orders.map((order) => (
                        <li key={order.id} className="order-item">
                          <span>{order.orderNumber}</span>
                          <span className="order-status">{order.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default Destination;
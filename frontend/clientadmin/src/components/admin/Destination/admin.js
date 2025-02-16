// components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { FaCog, FaSync, FaSave } from 'react-icons/fa';

const AdminPanel = () => {
  const [config, setConfig] = useState({ timeWindowMinutes: 20160, threshold: 10 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch current configuration
  const fetchConfig = async () => {
    try {
      const response = await axiosInstance.get('/config');
      setConfig(response.data.data);
    } catch (error) {
      console.error('Error fetching configuration:', error);
      setMessage('Failed to fetch configuration.');
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Handle configuration update
  const handleConfigUpdate = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put('/update', config);
      setMessage('Configuration updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error updating configuration:', error);
      setMessage('Failed to update configuration.');
      setLoading(false);
    }
  };

  // Handle manual re-planning
  const handleReplan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/replan-routes');
      setMessage('Routes re-planned successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error during re-planning:', error);
      setMessage('Failed to re-plan routes.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>
        <FaCog /> Admin Panel
      </h2>
      <div className="config-section">
        <h3>Threshold and Parameter Management</h3>
        <div className="form-group">
          <label>Time Window (minutes):</label>
          <input
            type="number"
            value={config.timeWindowMinutes}
            onChange={(e) => setConfig({ ...config, timeWindowMinutes: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Threshold for Direct Routes:</label>
          <input
            type="number"
            value={config.threshold}
            onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
          />
        </div>
        <button onClick={handleConfigUpdate} disabled={loading}>
          <FaSave /> Save Configuration
        </button>
      </div>
      <div className="replan-section">
        <h3>Manual Re-planning</h3>
        <button onClick={handleReplan} disabled={loading}>
          <FaSync /> Re-plan Routes
        </button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminPanel;
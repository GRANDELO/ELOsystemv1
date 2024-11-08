import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
    fetchActiveUsers();
    fetchDisabledUsers();
    fetchRegistrationGraph();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users/active');
      setActiveUsers(response.data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const fetchDisabledUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users/disabled');
      setDisabledUsers(response.data);
    } catch (error) {
      console.error('Error fetching disabled users:', error);
    }
  };

  const fetchRegistrationGraph = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/usersregistration-graph');
      setRegistrationData(response.data.graphData);
    } catch (error) {
      console.error('Error fetching registration graph data:', error);
    }
  };

  const disableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/users/disable/${userId}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const undoDisableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/users/undo-disable/${userId}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  // Prepare registration data for the chart
  const chartData = {
    labels: registrationData.map((item) => item._id),
    datasets: [
      {
        label: 'Registrations',
        data: registrationData.map((item) => item.count),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="usal-dashboard">
      <h1 className="usal-dashboard-title">Admin Dashboard</h1>

      {/* User List Section */}
      <section className="usal-section">
        <h2 className="usal-section-title">All Users</h2>
        <ul className="usal-user-list">
          {users.map((user) => (
            <li key={user._id} className="usal-user-item">
              <p>Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
              <p>Status: {user.isDisabled ? 'Disabled' : 'Active'}</p>
              <button
                onClick={() => disableUser(user._id)}
                className="usal-btn usal-btn-disable"
                disabled={user.isDisabled}
              >
                Disable
              </button>
              <button
                onClick={() => undoDisableUser(user._id)}
                className="usal-btn usal-btn-enable"
                disabled={!user.isDisabled}
              >
                Enable
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Active Users Section */}
      <section className="usal-section">
        <h2 className="usal-section-title">Active Users</h2>
        <ul className="usal-user-list">
          {activeUsers.map((user) => (
            <li key={user._id} className="usal-user-item">
              <p>Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Disabled Users Section */}
      <section className="usal-section">
        <h2 className="usal-section-title">Disabled Users</h2>
        <ul className="usal-user-list">
          {disabledUsers.map((user) => (
            <li key={user._id} className="usal-user-item">
              <p>Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Registration Graph Section */}
      <section className="usal-section">
        <h2 className="usal-section-title">Registrations Over Time</h2>
        <div className="usal-chart">
          <Bar data={chartData} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

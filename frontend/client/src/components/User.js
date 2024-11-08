import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Pagination from './Pagination';
import './styles/Users.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // Error state
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchActiveUsers();
    fetchDisabledUsers();
    fetchRegistrationGraph();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users');
      console.log("Fetched Users:", response.data); // Debugging log
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users/active');
      console.log("Fetched Active Users:", response.data); // Debugging log
      setActiveUsers(response.data);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error fetching active users:', error);
      setError('Failed to fetch active users');
    }
  };

  const fetchDisabledUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users/disabled');
      console.log("Fetched Disabled Users:", response.data); // Debugging log
      setDisabledUsers(response.data);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error fetching disabled users:', error);
      setError('Failed to fetch disabled users');
    }
  };

  const fetchRegistrationGraph = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/usersregistration-graph');
      console.log("Fetched Registration Graph Data:", response.data.graphData); // Debugging log
      setRegistrationData(response.data.graphData);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error fetching registration graph data:', error);
      setError('Failed to fetch registration graph data');
    }
  };

  const disableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/users/disable/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error disabling user:', error);
      setError('Failed to disable user');
    }
  };

  const undoDisableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/users/undo-disable/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error enabling user:', error);
      setError('Failed to enable user');
    }
  };

  // CSV export function
  const exportCSV = () => {
    const csvData = users.map(user => ({
      Name: user.fullName,
      Email: user.email,
      Status: user.isDisabled ? 'Disabled' : 'Active'
    }));
    const csvString = [
      ["Name", "Email", "Status"],
      ...csvData.map(item => [item.Name, item.Email, item.Status])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "user_data.csv");
  };

  // Pagination calculation
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter(user =>
        user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1); // Reset to first page after search
  };

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

      {/* Error Message */}
      {error && <div className="usal-error-message">{error}</div>}

      {/* Search and Export */}
      <div className="usal-dashboard-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or email"
          className="usal-search-input"
        />
        <button onClick={exportCSV} className="usal-btn usal-export-btn">Export CSV</button>
      </div>

      {/* User List with Pagination */}
      <section className="usal-section">
        <h2 className="usal-section-title">All Users</h2>
        <ul className="usal-user-list">
          {currentUsers.map(user => (
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
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          currentPage={currentPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </section>

      {/* Active Users */}
      <section className="usal-section">
        <h2 className="usal-section-title">Active Users</h2>
        <ul className="usal-user-list">
          {activeUsers.map(user => (
            <li key={user._id} className="usal-user-item">
              <p>Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Disabled Users */}
      <section className="usal-section">
        <h2 className="usal-section-title">Disabled Users</h2>
        <ul className="usal-user-list">
          {disabledUsers.map(user => (
            <li key={user._id} className="usal-user-item">
              <p>Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Registration Graph */}
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

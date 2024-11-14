import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import Pagination from '../../Pagination';
import '../../styles/Users.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1); // Track active user pagination
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null); // Track which user's details are expanded
  const [activeSection, setActiveSection] = useState('all'); // Tracks the active section
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchActiveUsers();
    fetchDisabledUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/employees');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/employees/getactiveemployees');
      setActiveUsers(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch active users');
    }
  };

  const fetchDisabledUsers = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/employees/getdisabledemployee');
      setDisabledUsers(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch disabled users');
    }
  };



  const disableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/employees/disable/${userId}`);
      fetchUsers();
    } catch (error) {
      setError('Failed to disable user');
    }
  };

  const undoDisableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/employees/undodisable/${userId}`);
      fetchUsers();
    } catch (error) {
      setError('Failed to enable user');
    }
  };

  const exportCSV = () => {
    const csvData = users.map(user => ({

      FirstName: user.firstName,
      WorkID: user.workID,
      Role: user.role
    }));
    const csvString = [
      ["Name", "Work ID", "Role"],
      ...csvData.map(item => [item.FirstName, item.WorkID, item.Role])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "Employee_data.csv");
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Active users pagination
  const indexOfLastActiveUser = activePage * usersPerPage;
  const indexOfFirstActiveUser = indexOfLastActiveUser - usersPerPage;
  const currentActiveUsers = activeUsers.slice(indexOfFirstActiveUser, indexOfLastActiveUser);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter(user =>
        user.role.toLowerCase().includes(term) || user.workID.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1); // Reset to first page after search
  };

  return (
    <div className="usal-dashboard">
      <h1 className="usal-dashboard-title">Admin Dashboard</h1>

      {error && <div className="usal-error-message">{error}</div>}

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

      {/* Section Control Buttons */}
      <div className="usal-section-controls">
        <button onClick={() => setActiveSection('all')} className="usal-btn">All Users</button>
        <button onClick={() => setActiveSection('active')} className="usal-btn">Active Users</button>
        <button onClick={() => setActiveSection('disabled')} className="usal-btn">Disabled Users</button>
      </div>

      {/* User List with Pagination */}
      {activeSection === 'all' && (
        <section className="usal-section">
          <h2 className="usal-section-title">All Users</h2>
          <ul className="usal-user-list">
            {currentUsers.map(user => (
              <li key={user._id} className="usal-user-item">
                <p>First Name: {user.firstName}</p>
                <p>Work ID: {user.workID}</p>
                <p>Role: {user.role}</p>

                {/* Show 'More' button to expand user options */}
                <button
                  onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                  className="usal-btn usal-btn-more"
                >
                  More
                </button>
                {/* Show additional user options if 'More' is clicked */}
                {expandedUserId === user._id && (
                  <div className="usal-user-options">
                    <p>Surname: {user.surname}</p>
                    <p>Status: {user.active}</p>
                    <p>Availability Status: {user.availabilityStatus}</p>

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
                  </div>
                )}
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
      )}

      {/* Active Users Section with Pagination */}
      {activeSection === 'active' && (
        <section className="usal-section">
          <h2 className="usal-section-title">Active Users</h2>
          <ul className="usal-user-list">
            {currentActiveUsers.map(user => (
              <li key={user._id} className="usal-user-item">
                <p>First Name: {user.firstName}</p>
                <p>Work ID: {user.workID}</p>
                <p>Role: {user.role}</p>
              </li>
            ))}
          </ul>
          <Pagination
            totalItems={activeUsers.length}
            itemsPerPage={usersPerPage}
            currentPage={activePage}
            onPageChange={(pageNumber) => setActivePage(pageNumber)}
          />
        </section>
      )}

      {/* Disabled Users Section */}
      {activeSection === 'disabled' && (
        <section className="usal-section">
          <h2 className="usal-section-title">Disabled Users</h2>
          <ul className="usal-user-list">
            {disabledUsers.map(user => (
              <li key={user._id} className="usal-user-item">
                <p>First Name: {user.firstName}</p>
                <p>Work ID: {user.workID}</p>
                <p>Role: {user.role}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
};

export default AdminDashboard;

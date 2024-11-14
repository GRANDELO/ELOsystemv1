import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import Pagination from '../../Pagination';
import '../styles/Users.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
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
      fetchActiveUsers();
      fetchDisabledUsers();
    } catch (error) {
      setError('Failed to disable user');
    }
  };

  const undoDisableUser = async (userId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/employees/undodisable/${userId}`);
      fetchUsers();
      fetchActiveUsers();
      fetchDisabledUsers();
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
    setCurrentPage(1);
  };

  return (
    <div className="emlis-dashboard">
      <h1 className="emlis-dashboard-title">Admin Dashboard</h1>

      {error && <div className="emlis-error-message">{error}</div>}

      <div className="emlis-dashboard-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or email"
          className="emlis-search-input"
        />
        <button onClick={exportCSV} className="emlis-btn emlis-export-btn">Export CSV</button>
      </div>

      <div className="emlis-section-controls">
        <button onClick={() => setActiveSection('all')} className="emlis-btn">All Users</button>
        <button onClick={() => setActiveSection('active')} className="emlis-btn">Active Users</button>
        <button onClick={() => setActiveSection('disabled')} className="emlis-btn">Disabled Users</button>
      </div>

      {activeSection === 'all' && (
        <section className="emlis-section">
          <h2 className="emlis-section-title">All Users</h2>
          <ul className="emlis-user-list">
            {currentUsers.map(user => (
              <li key={user._id} className="emlis-user-item">
                <p>First Name: {user.firstName}</p>
                <p>Work ID: {user.workID}</p>
                <p>Role: {user.role}</p>

                <button
                  onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                  className="emlis-btn emlis-btn-more"
                >
                  More
                </button>
                {expandedUserId === user._id && (
                  <div className="emlis-user-options">
                    <p>Surname: {user.surname}</p>
                    <p>Status: {user.active ? 'Active' : 'Not Active'}</p>
                    <p>Availability Status: {user.availabilityStatus}</p>

                    <button
                      onClick={() => disableUser(user._id)}
                      className="emlis-btn emlis-btn-disable"
                      disabled={user.isDisabled}
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => undoDisableUser(user._id)}
                      className="emlis-btn emlis-btn-enable"
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

      {activeSection === 'active' && (
        <section className="emlis-section">
          <h2 className="emlis-section-title">Active Users</h2>
          <ul className="emlis-user-list">
            {currentActiveUsers.map(user => (
              <li key={user._id} className="emlis-user-item">
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

      {activeSection === 'disabled' && (
        <section className="emlis-section">
          <h2 className="emlis-section-title">Disabled Users</h2>
          <ul className="emlis-user-list">
            {disabledUsers.map(user => (
              <li key={user._id} className="emlis-user-item">
                <p>First Name: {user.firstName}</p>
                <p>Work ID: {user.workID}</p>
                <p>Role: {user.role}</p>
                <button
                  onClick={() => undoDisableUser(user._id)}
                  className="emlis-btn emlis-btn-enable"
                  disabled={!user.isDisabled}
                >
                  Enable
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('https://elosystemv1.onrender.com/api/users');  // Adjust API endpoint as necessary
                setUsers(res.data);
                setFilteredUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filterUsers = () => {
            let result = users;

            if (search) {
                result = result.filter(user =>
                    user.username.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (roleFilter !== 'All') {
                result = result.filter(user => user.category === roleFilter);
            }

            setFilteredUsers(result);
        };

        filterUsers();
    }, [search, roleFilter, users]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`/api/users/${userId}`, { category: newRole });
            setUsers(users.map(user => 
                user._id === userId ? { ...user, category: newRole } : user
            ));
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const exportToCSV = () => {
        const headers = 'Name,Email,Role\n';
        const rows = filteredUsers.map(user => 
            `${user.username},${user.email},${user.category}`
        ).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="users-container">
            <h1>Users</h1>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="salesperson">Salesperson</option>
                </select>
                <button onClick={exportToCSV}>Export to CSV</button>
            </div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.category}</td>
                            <td>
                                <button onClick={() => setSelectedUser(user)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setSelectedUser(null)}>&times;</span>
                        <h2>{selectedUser.username}</h2>
                        <p>Email: {selectedUser.email}</p>
                        <p>Role: {selectedUser.category}</p>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;

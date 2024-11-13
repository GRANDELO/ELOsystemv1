// src/components/UserManagement.js
import React, { useState } from 'react';

function UserManagement() {
    const [users, setUsers] = useState([{ id: 1, name: 'Jane Doe', role: 'User' }]);
    const [newUser, setNewUser] = useState({ name: '', role: 'User' });

    const handleAddUser = () => {
        const updatedUsers = [...users, { id: users.length + 1, ...newUser }];
        setUsers(updatedUsers);
        setNewUser({ name: '', role: 'User' });
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="User Name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                />
                <select 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
                <button onClick={handleAddUser}>Add User</button>
            </div>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.role}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserManagement;

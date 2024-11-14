// src/components/AdminDashboard.js
import React from 'react';
import Overview from './Overview';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import Reports from './Reports';
import Notifications from './Notifications';

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <Overview />
            <UserManagement />
            <SystemSettings />
            <Reports />
            <Notifications />
        </div>
    );
}

export default AdminDashboard;

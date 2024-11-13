// src/components/Overview.js
import React from 'react';

function Overview() {
    // Example metrics (replace with API calls for live data)
    const metrics = {
        totalUsers: 120,
        activeSessions: 85,
        systemHealth: 'Good',
        recentUpdates: 'System upgrade completed on 2024-10-01'
    };

    return (
        <div className="overview">
            <h2>Overview</h2>
            <ul>
                <li>Total Users: {metrics.totalUsers}</li>
                <li>Active Sessions: {metrics.activeSessions}</li>
                <li>System Health: {metrics.systemHealth}</li>
                <li>Latest Update: {metrics.recentUpdates}</li>
            </ul>
        </div>
    );
}

export default Overview;

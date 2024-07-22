import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Reports from './Reports';
import Sales from './Sales';
import Users from './User';
import UserChart from './UserChart';

const Dashboard = () => {
    const [view, setView] = useState('summary');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [sales, setSales] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const totalUsersRes = await axios.get('/api/users/count');
                setTotalUsers(totalUsersRes.data.count);

                const activeUsersRes = await axios.get('/api/users/active-count');
                setActiveUsers(activeUsersRes.data.count);

                const salesRes = await axios.get('/api/sales/total');
                setSales(salesRes.data.total);

                const activitiesRes = await axios.get('/api/activities/recent');
                setRecentActivities(activitiesRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <nav>
                <button
                    className={`nav-button ${view === 'summary' ? 'active' : ''}`}
                    onClick={() => setView('summary')}
                >
                    Summary
                </button>
                <button
                    className={`nav-button ${view === 'users' ? 'active' : ''}`}
                    onClick={() => setView('users')}
                >
                    Users
                </button>
                <button
                    className={`nav-button ${view === 'chart' ? 'active' : ''}`}
                    onClick={() => setView('chart')}
                >
                    User Chart
                </button>
                <button
                    className={`nav-button ${view === 'sales' ? 'active' : ''}`}
                    onClick={() => setView('sales')}
                >
                    Sales
                </button>
                <button
                    className={`nav-button ${view === 'reports' ? 'active' : ''}`}
                    onClick={() => setView('reports')}
                >
                    Reports
                </button>
            </nav>

            <div className="content">
                {view === 'summary' && (
                    <div>
                        <div className="dashboard-metrics">
                            <div className="metric">
                                <h2>Total Users</h2>
                                <p>{totalUsers}</p>
                            </div>
                            <div className="metric">
                                <h2>Active Users</h2>
                                <p>{activeUsers}</p>
                            </div>
                            <div className="metric">
                                <h2>Total Sales</h2>
                                <p>{sales}</p>
                            </div>
                        </div>
                        <div className="recent-activities">
                            <h2>Recent Activities</h2>
                            <ul>
                                {recentActivities.map(activity => (
                                    <li key={activity.id}>{activity.description}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="quick-links">
                            <h2>Quick Links</h2>
                            <ul>
                                <li><a href="/users">Users</a></li>
                                <li><a href="/sales">Sales</a></li>
                                <li><a href="/reports">Reports</a></li>
                            </ul>
                        </div>
                    </div>
                )}
                {view === 'users' && <Users />}
                {view === 'chart' && <UserChart />}
                {view === 'sales' && <Sales />}
                {view === 'reports' && <Reports />}
            </div>
        </div>
    );
};

export default Dashboard;

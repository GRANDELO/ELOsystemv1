import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reports from '../Reports';
import Users from '../User';
import Footer from './Footer';
import UserChart from './UserChart';
import Header from './header';
import HR from './hr/hrdash';
import Sales from './sales/Salespg';
import Setting from './settings';
import './styles/Dashboard.css';

const Dashboard = () => {
    const [view, setView] = useState('summary');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    const handleLogout = () => {
        navigate('/admnLogout');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const totalUsersRes = await axios.get('https://elosystemv1.onrender.com/api/dash/users/count');
                setTotalUsers(totalUsersRes.data.count);

                const activeUsersRes = await axios.get('https://elosystemv1.onrender.com/api/dash/users/active-count');
                setActiveUsers(activeUsersRes.data.count);

                const response = await axios.get('https://elosystemv1.onrender.com/api/financials/summary');
                setSummary(response.data);

                const activitiesRes = await axios.get('https://elosystemv1.onrender.com/api/dash/activities/recent');
                setRecentActivities(activitiesRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="dashad-dashboard-container">
                <Header />
                <Setting />
                <nav className="dashad-nav">
                    <button
                        className={`dashad-nav-button ${view === 'summary' ? 'dashad-active' : ''}`}
                        onClick={() => setView('summary')}
                    >
                        Summary
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'users' ? 'dashad-active' : ''}`}
                        onClick={() => setView('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'chart' ? 'dashad-active' : ''}`}
                        onClick={() => setView('chart')}
                    >
                        User Chart
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'sales' ? 'dashad-active' : ''}`}
                        onClick={() => setView('sales')}
                    >
                        Sales
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'HR' ? 'dashad-active' : ''}`}
                        onClick={() => setView('HR')}
                    >
                        HR
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'reports' ? 'dashad-active' : ''}`}
                        onClick={() => setView('reports')}
                    >
                        Reports
                    </button>
                </nav>

                <div className="dashad-content">
                    {view === 'summary' && (
                        <div className="dashad-summary-section">
                            <div className="dashad-dashboard-metrics">
                                <div className="dashad-metric">
                                    <h2>Total Users</h2>
                                    <p>{totalUsers}</p>
                                </div>
                                <div className="dashad-metric">
                                    <h2>Active Users</h2>
                                    <p>{activeUsers}</p>
                                </div>
                                <div className="dashad-metric">
                                    <h2>Total Sales</h2>
                                    <p className={`dashad-sal-amount ${summary && summary.netBalance >= 0 ? 'dashad-sal-positive' : 'dashad-sal-negative'}`}>
                                        {summary ? summary.netBalance.toLocaleString() : 'Loading...'}
                                    </p>
                                </div>
                            </div>
                            <div className="dashad-recent-activities">
                                <h2>Recent Activities</h2>
                                <ul className="dashad-activity-list">
                                    {recentActivities.map(activity => (
                                        <li key={activity.id}>{activity.description}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="dashad-quick-links">
                                <h2>Quick Links</h2>
                                <ul>
                                    <li><a href="/users">Users</a></li>
                                    <li><a href="/sales">Sales</a></li>
                                    <li><a href="/reports">Reports</a></li>
                                    <li><a href="/hr">HR</a></li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {view === 'users' && <Users />}
                    {view === 'chart' && <UserChart />}
                    {view === 'sales' && <Sales />}
                    {view === 'HR' && <HR />}
                    {view === 'reports' && <Reports />}
                </div>
                
            </div>
            <Footer/>
        </div>

    );
};

export default Dashboard;

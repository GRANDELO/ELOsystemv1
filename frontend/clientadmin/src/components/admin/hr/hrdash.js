import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hr.css';
import EmployeeList from './EmployeeList';
import Employies from './employies';

const Dashboard = () => {
    const [view, setView] = useState('users');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    const handleLogout = () => {
        navigate('/logout');
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
        <div className="hralld-dashboard-container">
            <nav className="hralld-nav">
                <button
                    className={`hralld-nav-button ${view === 'users' ? 'active' : ''}`}
                    onClick={() => setView('users')}
                >
                    Employees
                </button>
                <button
                    className={`hralld-nav-button ${view === 'chart' ? 'active' : ''}`}
                    onClick={() => setView('chart')}
                >
                    Register Employee
                </button>
            </nav>

            <div className="hralld-content">

                {view === 'users' && <EmployeeList />}
                {view === 'chart' && <Employies />}
            </div>
        </div>
    );
};

export default Dashboard;

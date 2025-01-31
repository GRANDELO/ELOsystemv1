import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hr.css';
import EmployeeList from './EmployeeList';
import Employies from './employies';
import Agent from './agent';
import Deliverypeople from './deliverypeople';

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
                const totalUsersRes = await axiosInstance.get('/dash/users/count');
                setTotalUsers(totalUsersRes.data.count);

                const activeUsersRes = await axiosInstance.get('/dash/users/active-count');
                setActiveUsers(activeUsersRes.data.count);

                const response = await axiosInstance.get('/financials/summary');
                setSummary(response.data);

                const activitiesRes = await axiosInstance.get('/dash/activities/recent');
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
                <button
                    className={`hralld-nav-button ${view === 'agent' ? 'active' : ''}`}
                    onClick={() => setView('agent')}
                >
                    Agents
                </button>
                <button
                    className={`hralld-nav-button ${view === 'deliverypeople' ? 'active' : ''}`}
                    onClick={() => setView('deliverypeople')}
                >
                    Delivery Personnel
                </button>
            </nav>

            <div className="hralld-content">

                {view === 'deliverypeople' && <Deliverypeople />}
                {view === 'users' && <EmployeeList />}
                {view === 'chart' && <Employies />}
                {view === 'agent' && <Agent />}
            </div>
        </div>
    );
};

export default Dashboard;

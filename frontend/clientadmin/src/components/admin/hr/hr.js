import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../header';
import Setting from '../settings';
import '../styles/hrd.css';
import Hrdash from './hrdash';

const Dashboard = () => {
    const [view, setView] = useState('summary');
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
        <div className="hrd-dash-container">
            <Header />
            <Setting />
            <Hrdash />
            <Footer/>
        </div>
    );
};

export default Dashboard;

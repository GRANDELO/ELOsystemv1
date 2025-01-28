import axiosInstance from '../../axiosInstance';
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
        <div className="hrd-dash-container">
            <Header />
            <Setting />
            <Hrdash />
            <Footer/>
        </div>
    );
};

export default Dashboard;

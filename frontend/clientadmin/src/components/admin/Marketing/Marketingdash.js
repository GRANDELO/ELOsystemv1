import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hr.css';
import BlogHome from "../../../pages/BlogHome";
import BlogDetails from "../../../pages/BlogDetails";
import CreateBlog from "../../../pages/CreateBlog";
import EditBlog from "../../../pages/EditBlog";

const Dashboard = () => {
    const [view, setView] = useState('BlogHome');
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
                    className={`hralld-nav-button ${view === 'BlogHome' ? 'active' : ''}`}
                    onClick={() => setView('BlogHome')}
                >
                    View all
                </button>
                <button
                    className={`hralld-nav-button ${view === 'BlogDetails' ? 'active' : ''}`}
                    onClick={() => setView('BlogDetails')}
                >
                    Blog Details
                </button>
                <button
                    className={`hralld-nav-button ${view === 'CreateBlog' ? 'active' : ''}`}
                    onClick={() => setView('CreateBlog')}
                >
                    Create Blog
                </button>
                <button
                    className={`hralld-nav-button ${view === 'EditBlog' ? 'active' : ''}`}
                    onClick={() => setView('EditBlog')}
                >
                    Edit Blog 
                </button>
            </nav>

            <div className="hralld-content">

                {view === 'EditBlog' && <EditBlog />}
                {view === 'users' && <BlogHome />}
                {view === 'BlogDetails' && <BlogDetails />}
                {view === 'CreateBlog' && <CreateBlog />}
            </div>
        </div>
    );
};

export default Dashboard;

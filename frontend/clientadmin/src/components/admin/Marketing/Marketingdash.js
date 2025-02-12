import axiosInstance from '../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Dashboards.css';
import BlogHome from "../../../pages/BlogHome";
import BlogDetails from "../../../pages/BlogDetails";
import CreateBlog from "../../../pages/CreateBlog";
import EditBlog from "../../../pages/EditBlog";

const Dashboard = () => {
  const [view, setView] = useState('BlogHome');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

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

        const summaryRes = await axiosInstance.get('/financials/summary');
        setSummary(summaryRes.data);

        const activitiesRes = await axiosInstance.get('/dash/activities/recent');
        setRecentActivities(activitiesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Marketing Dashboard</h1>
      </header>
      <nav className="dashboard-nav">
        <button
          className={`nav-button ${view === 'BlogHome' ? 'active' : ''}`}
          onClick={() => setView('BlogHome')}
        >
          View All
        </button>
        <button
          className={`nav-button ${view === 'BlogDetails' ? 'active' : ''}`}
          onClick={() => setView('BlogDetails')}
        >
          Blog Details
        </button>
        <button
          className={`nav-button ${view === 'CreateBlog' ? 'active' : ''}`}
          onClick={() => setView('CreateBlog')}
        >
          Create Blog
        </button>
        <button
          className={`nav-button ${view === 'EditBlog' ? 'active' : ''}`}
          onClick={() => setView('EditBlog')}
        >
          Edit Blog
        </button>
      </nav>
      <main className="dashboard-content">
        {view === 'BlogHome' && <BlogHome />}
        {view === 'BlogDetails' && <BlogDetails />}
        {view === 'CreateBlog' && <CreateBlog />}
        {view === 'EditBlog' && <EditBlog />}
      </main>
    </div>
  );
};

export default Dashboard;

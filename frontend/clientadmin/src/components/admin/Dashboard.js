import axiosInstance from '../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reports from '../Reports';
import Users from '../User';
import Footer from './Footer';
import UserChart from './UserChart';
import Header from './header';
import HR from './hr/hrdash';
import Accouns from './accouns/accountsdash';
import io from 'socket.io-client';
import Sales from './sales/Salespg';
import Setting from './settings';
import AdminFeedback from '../feedback';
import './styles/Dashboard.css';

const socket = io('https://elosystemv1.onrender.com/api');

const Dashboard = () => {
    const [view, setView] = useState('summary');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    const handleLogout = () => {
        navigate('/admnLogout');
    };

    const fetchDestinations = async () => {
        try {
            const response = await axiosInstance.post('/plan-delivery'); // API call to fetch destinations
            console.log('Backend Response:', response.data.data);
            
            const { directRoutes = [], hubRoutes= [] } = response.data.data;


            const processRoutes = ( routes, type) => 
                routes.map(routes => ({
                    type,
                    origin: routes.origin,
                    destination: routes.destination,
                    orderCount: routes.orderCount,
                    orders: routes.orders.map(order => ({
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: 'pending',
                    })),
                }));

                const directDestinations = processRoutes(directRoutes, 'Direct');
                const hubDestination = processRoutes(hubRoutes, 'Hub');

                setDestinations([...directDestinations, ...hubDestination]);
       } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    useEffect(() => {
        fetchDestinations();
    
        socket.on('updateDestinations', ({ directRoutes, hubRoutes }) => {
          console.log('Received from socket:', { directRoutes, hubRoutes });
          const processRoutes = (routes, type) =>
            routes.map(route => ({
              type,
              origin: route.origin,
              destination: route.destination,
              orderCount: route.orderCount,
              orders: route.orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: 'pending',
              })),
            }));
    
          const directDestinations = processRoutes(directRoutes, 'Direct');
          const hubDestination = processRoutes(hubRoutes, 'Hub');
    
          setDestinations([...directDestinations, ...hubDestination]);
        });
    
        return () => {
          socket.off('updateDestinations');
        };
      }, []);
    

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

    useEffect(() => {
        if (view === 'destinations') {
            fetchDestinations(); // Fetch destinations when the Destinations view is active
        }
    }, [view])

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
                    <button
                        className={`dashad-nav-button ${view === 'feedback' ? 'dashad-active' : ''}`}
                        onClick={() => setView('feedback')}
                    >
                        Feedback
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'Accouns' ? 'dashad-active' : ''}`}
                        onClick={() => setView('Accouns')}
                    >
                        Accouns
                    </button>
                    <button
                        className={`dashad-nav-button ${view === 'destinations' ? 'dashad-active' : ''}`}
                        onClick={() => setView('destinations')}
                    >
                        Destinations
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
                    {view === 'feedback' && <AdminFeedback />}
                    {view === 'Accouns' && <Accouns />}
                    {view === 'destinations' && (
                         <div className="dashad-destinations-section">
                         <h2>Destinations</h2>
                         {destinations.length === 0 ? (
                             <p>No available destinations.</p>
                         ) : (
                             <div>
                                 <h3>Direct Routes</h3>
                                 {destinations.filter(d => d.type === 'Direct').length === 0 ? (
                                     <p>No direct routes available.</p>
                                 ) : (
                                     <ul>
                                         {destinations
                                             .filter(d => d.type === 'Direct')
                                             .map((destination, index) => (
                                                 <li key={index}>
                                                     <strong>Origin:</strong> {destination.origin.county}, {destination.origin.town}, {destination.origin.area} -{" "}
                                                     <strong>Destination:</strong> {destination.destination.county}, {destination.destination.town}, {destination.destination.area} -{" "}
                                                     <strong>Number of Orders:</strong> {destination.orderCount} -{" "}
                                                     <strong>Orders:</strong>{" "}
                                                     {destination.orders.length > 0 ? (
                                                         destination.orders.map((order, orderIndex) => (
                                                             <span key={orderIndex}>
                                                                 Order #{order.orderNumber}
                                                                 {orderIndex !== destination.orders.length - 1 ? ", " : ""}
                                                             </span>
                                                         ))
                                                     ) : (
                                                         <em>No orders</em>
                                                     )}
                                                 </li>
                                             ))}
                                     </ul>
                                 )}
             
                                 <h3>Hub Routes</h3>
                                 {destinations.filter(d => d.type === 'Hub').length === 0 ? (
                                     <p>No hub routes available.</p>
                                 ) : (
                                     <ul>
                                         {destinations
                                             .filter(d => d.type === 'Hub')
                                             .map((destination, index) => (
                                                 <li key={index}>
                                                     <strong>Origin:</strong> {destination.origin.county}, {destination.origin.town}, {destination.origin.area} -{" "}
                                                     <strong>Destination:</strong> {destination.destination.county}, {destination.destination.town}, {destination.destination.area} -{" "}
                                                     <strong>Number of Orders:</strong> {destination.orderCount} -{" "}
                                                     <strong>Orders:</strong>{" "}
                                                     {destination.orders.length > 0 ? (
                                                         destination.orders.map((order, orderIndex) => (
                                                             <span key={orderIndex}>
                                                                 Order #{order.orderNumber}
                                                                 {orderIndex !== destination.orders.length - 1 ? ", " : ""}
                                                             </span>
                                                         ))
                                                     ) : (
                                                         <em>No orders</em>
                                                     )}
                                                 </li>
                                             ))}
                                     </ul>
                                 )}
                             </div>
                         )}
                     </div>
                    )}
                    </div>
                  </div>
            <Footer/>
        </div>
    );

};

export default Dashboard;

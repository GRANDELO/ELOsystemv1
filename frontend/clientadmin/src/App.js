import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';

import RequireAuth from './RequireAuth'; // Import the authentication check component

import ProtectedRoute from './components/ProtectRoute';
import Reports from './components/Reports';
import Users from './components/User';
import UserChart from './components/UserChart';

import Dashboard from './components/admin/Dashboard';
import Loginadm from './components/admin/Login';
import Logistics from './components/admin/Logistics';
import AdmnLogout from './components/admin/admnLogout';
import Admpasswordreset from './components/admin/admpasswordreset';
import Employies from './components/admin/hr/employies';
import Hr from './components/admin/hr/hr';
import Packingpage from './components/admin/packingpage';
import Sales from './components/admin/sales/Sales';



import './main.css';

const socket = io('https://elosystemv1.onrender.com');

const App = () => {
  useEffect(() => {
    const keepAlive = () => {
      fetch('https://elosystemv1.onrender.com/api/products')
        .then(response => {
          if (!response.ok) {
            console.error('Failed to ping backend:', response.status);
          }
        })
        .catch(error => {
          console.error('Error pinging backend:', error);
        });
    };

    const intervalId = setInterval(keepAlive, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Loginadm />} />
          <Route path="/loginadm" element={<Loginadm />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />} >
            <Route path="/dashboard"
              element={
                <ProtectedRoute>
                 <Dashboard />
                </ProtectedRoute>
                 } />



            <Route path="/userChart" element={<UserChart />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sales" element={<Sales />} />

            <Route path="/employies" element={<Employies />} />
            <Route path="/hr" element={<Hr />} />
            <Route path="/logistics" element={<Logistics />} />

            <Route path="/admnLogout" element={<AdmnLogout />} />
            <Route path="/admpasswordreset" element={<Admpasswordreset />} />

            <Route path="/packingpage" element={<Packingpage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

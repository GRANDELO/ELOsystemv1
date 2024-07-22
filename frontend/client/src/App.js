import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProductForm from './components/ProductForm';
import ProductDetails from './components/ProductsDetail';
import ProductList from './components/ProductsList';
import Register from './components/Register';
import Reports from './components/Reports';
import Sales from './components/Sales';
import Success from './components/Success';
import Users from './components/User';
import UserChart from './components/UserChart';
import Verification from './components/Verification';
import Home from './components/home';
import Passwordrecovery from './components/passwordreset';
import Salespersonhome from './components/salespersonhome';
import Seller from './components/sellerHome';
import Upload from './components/upload';
const socket = io('https://elosystemv1.onrender.com');

const App = () => {
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
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/home" element={<Home />} />
          <Route path="/productForm" element={<ProductForm />} />
          <Route path="/:id" element={<ProductDetails />} />
          <Route path="/reset-password" element={<Passwordrecovery />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/salespersonhome" element={<Salespersonhome />} />
          <Route path="/userChart" element={<UserChart />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

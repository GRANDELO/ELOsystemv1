import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './components/Login';
import ProductForm from './components/ProductForm';
import Register from './components/Register';
import Success from './components/Success';
import Verification from './components/Verification';
import Home from './components/home';
import Passwordrecovery from './components/passwordreset';
import ProductDetails from './components/ProductsDetail';
import ProductList from './components/ProductsList';
import Seller from './components/sellerHome';

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
          <Route path="/protected" element={<ProtectedComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

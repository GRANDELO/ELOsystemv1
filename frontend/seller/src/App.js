import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';

import RequireAuth from './RequireAuth'; // Import the authentication check component
import ImageList from './components/ImageList';
import ImageUpload from './components/ImageUpload';
import Login from './components/Login';
import AgentLogin from './components/AgentLogin';
import Set from './components/set';
import AgentRegister from './components/AgentRegister';
import AgentVerification from './components/AgentVerification';
import Agentpasswordreset from './components/agentpasswordreset';
import AgentSuccess from './components/AgentSuccess';
import Loginselectore from './components/loginselectore';
import Agentpros from './components/agentpros';
import Agentinput from './components/agentinput';
import Agentboxdisp from './components/agentboxdisp';



import Logout from './components/Logout';
import NewProductDetail from './components/NewProductDetail';
import NewProductEdit from './components/NewProductEdit';
import NewProductForm from './components/NewProductForm';
import PaymentForm from './components/PaymentForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductsList';
import ProtectedRoute from './components/ProtectRoute';
import Register from './components/Register';
import Success from './components/Success';
import Verification from './components/Verification';
import Registerselector from './components/registerselector';

import Coreordering from './components/coreordering';
import Displayorder from './components/displayorder';
import Home from './components/home';
import Image from './components/image';
import Notification from './components/notification';
import Passwordrecovery from './components/passwordreset';
import Productperfomance from './components/productperfomance';
import Upload from './components/upload';

import ChatList from "./components/ChatList";
import ChatDetails from "./components/ChatDetails";

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
          <Route path="/sellerlogin" element={<Login />} />
          <Route path="/registerseller" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/coreorder" element={<Coreordering />} />
          <Route path="/set" element={<Set />} />
          <Route path="/testHome" element={<Home />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/agentRegister" element={<AgentRegister />} />
          <Route path="/agentVerification" element={<AgentVerification />} />
          <Route path="/agentLogin" element={<AgentLogin />} />
          <Route path="/agentpasswordreset" element={<Agentpasswordreset />} />
          <Route path="/agentSuccess" element={<AgentSuccess />} />
          <Route path="/register" element={<Registerselector />} />
          <Route path="/" element={<Loginselectore />} />
          <Route path="/agentpros" element={<Agentpros />} />
          <Route path="/agentinput" element={<Agentinput />} />
          <Route path="/agentboxdisp" element={<Agentboxdisp />} />

          
          <Route path="/chatall" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatDetails />} />
          {/* Protected routes */}
          <Route element={<RequireAuth />} >

            <Route path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
            <Route path="/productForm" element={<ProductForm />} />
            <Route path="/reset-password" element={<Passwordrecovery />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/upload" element={<Upload />} />

            <Route path="/logout" element={<Logout />} />

            <Route path="/newproductform" element={<NewProductForm />} />
            <Route path="/newproductdetail" element={<NewProductDetail />} />
            <Route path="/newproductedit" element={<NewProductEdit />} />
            <Route path="/image" element={<Image />} />
            <Route path="/paymentForm" element={<PaymentForm />} />
            <Route path="/imageList" element={<ImageList />} />
            <Route path="/imageUpload" element={<ImageUpload />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/displayorder" element={<Displayorder />} />
            <Route path="/productperfomance" element={<Productperfomance />} />

          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';

import RequireAuth from './RequireAuth'; // Import the authentication check component
import ImageList from './components/ImageList';
import ImageUpload from './components/ImageUpload';
import Login from './components/Login';
import LogisticPage from './components/Logistics';
import Logout from './components/Logout';
import NewProductDetail from './components/NewProductDetail';
import NewProductEdit from './components/NewProductEdit';
import NewProductForm from './components/NewProductForm';
import NewProductList from './components/NewProductList';
import Order from "./components/OrderingPage";
import PaymentForm from './components/PaymentForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductsList';
import ProtectedRoute from './components/ProtectRoute';
import Register from './components/Register';
import Reports from './components/Reports';
import Sales from './components/Sales';
import Success from './components/Success';
import Users from './components/User';
import UserChart from './components/UserChart';
import Verification from './components/Verification';

import Dashboard from './components/admin/Dashboard';
import Loginadm from './components/admin/Login';
import AdminDashboard from './components/admin/admindash/AdminDashboard';
import Employies from './components/admin/employies';
import Packingpage from './components/admin/packingpage';


import Coreordering from './components/coreordering';
import Displayorder from './components/displayorder';
import Home from './components/home';
import Image from './components/image';
import Notification from './components/notification';
import Passwordrecovery from './components/passwordreset';
import Productperfomance from './components/productperfomance';
import Regdeliverypeople from './components/regdeliverypeople';
import Salespersonhome from './components/salespersonhome';
import Seller from './components/sellerHome';
import Upload from './components/upload';

import './main.css';

const socket = io('https://elosystemv1.onrender.com');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
}

const publicVapidKey = 'BNK_K1aaB3ntQ_lInFtrXC01vHCZ4lLTCBS37fgOXMzbApF6Y5-mRQ2aIXXTzKpzdn_Rl9uARa8I5gCiz6kqWGE';

async function subscribeUser() {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // Send subscription to backend
        await axios.post('https://elosystemv1.onrender.com/api/not/subscribe', subscription);
    }
}

// Helper function to convert VAPID key to UInt8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Call this function to initiate subscription when a user agrees
subscribeUser();




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
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/coreorder" element={<Coreordering />} />


          {/* Protected routes */}
          <Route element={<RequireAuth />} >
            <Route path="/dashboard"
              element={
                <ProtectedRoute>
                 <Dashboard />
                </ProtectedRoute>
                 } />
            <Route path="/verification" element={<Verification />} />
            <Route path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
            <Route path="/productForm" element={<ProductForm />} />
            <Route path="/reset-password" element={<Passwordrecovery />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/salespersonhome" 
               element={
                <ProtectedRoute>
                  <Salespersonhome />
                </ProtectedRoute>
               } />
            <Route path="/userChart" element={<UserChart />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/order" element={<Order />} />

            <Route path="/regdeliverypeople" element={<Regdeliverypeople />} />
            <Route path="/newproductform" element={<NewProductForm />} />
            <Route path="/newproductlist" element={<NewProductList />} />
            <Route path="/newproductdetail" element={<NewProductDetail />} />
            <Route path="/newproductedit" element={<NewProductEdit />} />
            <Route path="/image" element={<Image />} />
            <Route path="/paymentForm" element={<PaymentForm />} />
            <Route path="/imageList" element={<ImageList />} />
            <Route path="/imageUpload" element={<ImageUpload />} />
            <Route path="/logistics" element={<LogisticPage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/displayorder" element={<Displayorder />} />
            <Route path="/productperfomance" element={<Productperfomance />} />

            <Route path="/employies" element={<Employies />} />
            <Route path="/loginadm" element={<Loginadm />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />

            <Route path="/packingpage" element={<Packingpage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

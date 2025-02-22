import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Navigate } from "react-router-dom";
import  ReturnPolicy from './pages/returnPolicy'
import RequireAuth from './RequireAuth'; // Import the authentication check component
import ImageList from './components/ImageList';
import ImageUpload from './components/ImageUpload';
import Login from './components/Login';
import Set from './components/set';
import Review from './components/review';
import Verificationauto from './components/Verificationauto';
import Website from './components/website';
import ReturnForm from './components/returnForm';
import BlogHome from "./pages/BlogHome";
import BlogDetails from "./pages/BlogDetails";


import Shop from './components/Shop';
import Chatbot from './utils/chatbot';
import AdminQA from './utils/AdminQA';


import Productmodelpage from './components/productmodelpage';

import Logout from './components/Logout';
import NewProductDetail from './components/NewProductDetail';
import NewProductEdit from './components/NewProductEdit';
import NewProductForm from './components/NewProductForm';
import NewProductList from './components/NewProductListc';
import Order from "./components/OrderingPage";
import PaymentForm from './components/PaymentForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductsList';
import ProtectedRoute from './components/ProtectRoute';
import Register from './components/Register';
import Success from './components/Success';
import Verification from './components/Verification';

import FeedbackForm from './components/Feedback';


import Coreordering from './components/coreordering';
import Displayorder from './components/displayorder';
//import Home from './components/home';
import Image from './components/image';
import Notification from './components/notification';
import Passwordrecovery from './components/passwordreset';
import Productperfomance from './components/productperfomance';
import Regdeliverypeople from './components/regdeliverypeople';
import Home from './components/salespersonhome';
import Upload from './components/upload';

import ChatList from "./components/ChatList";
import ChatDetails from "./components/ChatDetails";

import ThemeProvider from "./ThemeContext";
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
    <ThemeProvider>
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/coreorder" element={<Coreordering />} />
          <Route path="/set" element={<Set />} />
          <Route path="/testHome" element={<Home />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/review" element={<Review />} />
          <Route path="/auto" element={<Verificationauto />} />
          <Route path="/website" element={<Home />} />
          <Route path="/site" element={<Website />} />
          <Route path="/return" element={<ReturnPolicy/> } />
          <Route path="/productmodelpage/:id" element={<Productmodelpage />} />
          
          <Route path="/blogs" element={<BlogHome />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          
          <Route path="/returnForm" element={<ReturnForm />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/Chatbot" element={<Chatbot />} />
          <Route path="/adminQA" element={<AdminQA />} />
          
          <Route path="/reset-password" element={<Passwordrecovery />} />
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
            <Route path="/products" element={<ProductList />} />
            <Route path="/upload" element={<Upload />} />
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
            <Route path="/notification" element={<Notification />} />
            <Route path="/displayorder" element={<Displayorder />} />
            <Route path="/productperfomance" element={<Productperfomance />} />
            <Route path="/feedback" element={<FeedbackForm />} />
          </Route>
            {/* Catch all invalid routes and redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;


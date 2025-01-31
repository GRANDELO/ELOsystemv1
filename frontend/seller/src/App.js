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
import Agentboxinput from './components/agentboxinput';
import Agentdash from './components/agentdash';
import AgentLogout from './components/agentLogout';
import Agentsettings from './components/Agentsettings';
import Verificationauto from './components/Verificationauto';

import Talk from './components/talk';

import Verificationautodeli from './components/Verificationautodeli';
import Verificationautoagent from './components/Verificationautoagent';
import DeliveryLogout from './components/deliveryLogout';
import DeliveryLogin from './components/deliveryLogin';
import DeliveryRegister from './components/deliveryRegister';
import DeliverySuccess from './components/deliverySuccess';
import Deliverypasswordreset from './components/deliverypasswordreset';
import DeliveryVerification from './components/deliveryVerification';
import Deliveryaccept from './components/deliveryaccept';
import Deliverydisp from './components/deliverydisp';
import Deliverydash from './components/deliverydash';

import MM from './components/mm';
import Generators from './components/generators';

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
import Colabonewproduct from "./components/colabonewproduct";
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
          
          <Route path="/colabonewproduct" element={<Colabonewproduct />} />

          <Route path="/sellerlogin" element={<Login />} />
          <Route path="/registerseller" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/coreorder" element={<Coreordering />} />
          <Route path="/set" element={<Set />} />
          <Route path="/testHome" element={<Home />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/auto" element={<Verificationauto />} />
          <Route path="/agentRegister" element={<AgentRegister />} />
          <Route path="/agentVerification" element={<AgentVerification />} />
          <Route path="/agentLogin" element={<AgentLogin />} />
          <Route path="/agentpasswordreset" element={<Agentpasswordreset />} />
          <Route path="/agentSuccess" element={<AgentSuccess />} />
          <Route path="/register" element={<Registerselector />} />
          <Route path="/" element={<Loginselectore />} />

          <Route element={<RequireAuth />} ></Route>



          <Route path="/agentpros" element={<ProtectedRoute> <Agentpros /> </ProtectedRoute>} />
          <Route path="/agentinput" element={ <ProtectedRoute> <Agentinput /> </ProtectedRoute>} />
          <Route path="/agentboxdisp" element={ <ProtectedRoute> <Agentboxdisp /> </ProtectedRoute>} />
          <Route path="/agentboxinput" element={<ProtectedRoute> <Agentboxinput /> </ProtectedRoute>} />
          <Route path="/agentdash" element={<ProtectedRoute><Agentdash />  </ProtectedRoute> } />
          <Route path="/agentLogout" element={<ProtectedRoute> <AgentLogout />  </ProtectedRoute> } />
          <Route path="/agentsettings" element={<ProtectedRoute><Agentsettings /></ProtectedRoute>} />
          
          <Route path="/MM" element={<ProtectedRoute> <MM /> </ProtectedRoute>} />
          <Route path="/generators" element={<ProtectedRoute> < Generators /></ProtectedRoute>} />
          <Route path="/Talk" element={<ProtectedRoute> <Talk /></ProtectedRoute>} />
          
          <Route path="/deliveryLogin" element={<DeliveryLogin />} />
          <Route path="/deliveryRegister" element={<DeliveryRegister />} />
          <Route path="/deliverySuccess" element={<DeliverySuccess />} />
          <Route path="/deliverypasswordreset" element={<Deliverypasswordreset />} />
          <Route path="/deliveryVerification" element={<DeliveryVerification />} />
          <Route path="/deliveryaccept" element={<Deliveryaccept />} />
          <Route path="/deliverydisp" element={<ProtectedRoute><Deliverydisp /></ProtectedRoute>} />
          <Route path="/deliveryLogout" element={<ProtectedRoute> <DeliveryLogout /></ProtectedRoute>} />
          <Route path="/deliverydash" element={<ProtectedRoute><Deliverydash /></ProtectedRoute>} />
          <Route path="/verificationautodeli" element={ <Verificationautodeli />} />
          <Route path="/verificationautoagent" element={<Verificationautoagent />} />


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

            <ProtectedRoute> </ProtectedRoute>
            <Route path="/newproductform" element={<ProtectedRoute>  <NewProductForm />  </ProtectedRoute>} />
            <Route path="/newproductdetail" element={<ProtectedRoute> <NewProductDetail /> </ProtectedRoute>} />
            <Route path="/newproductedit" element={<ProtectedRoute> <NewProductEdit /> </ProtectedRoute>} />
            <Route path="/image" element={<ProtectedRoute> <Image />  </ProtectedRoute>} />
            <Route path="/paymentForm" element={<ProtectedRoute> <PaymentForm /></ProtectedRoute>} />
            <Route path="/imageList" element={<ProtectedRoute><ImageList /> </ProtectedRoute>} />
            <Route path="/imageUpload" element={<ProtectedRoute> <ImageUpload /> </ProtectedRoute>} />
            <Route path="/notification" element={<ProtectedRoute> <Notification /> </ProtectedRoute>} />
            <Route path="/displayorder" element={<ProtectedRoute><Displayorder />  </ProtectedRoute>} />
            <Route path="/productperfomance" element={<ProtectedRoute> <Productperfomance /> </ProtectedRoute>} />

          </Route>
        
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;

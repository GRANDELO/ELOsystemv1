import React from 'react';
import { io } from 'socket.io-client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Success from './components/Success';
import Verifyication from './components/Verification';
import Home from './components/home';
import './components/styles.css';

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
          <Route path="/Success" element={<Success />} />
          <Route path="/verifyication" element={<Verifyication />} />
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

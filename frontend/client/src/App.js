import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Success from './components/Success';
import Verifyication from './components/Verification';
import './components/styles.css';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/verifyication" element={<Verifyication />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

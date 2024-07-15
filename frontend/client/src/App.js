import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Thankyou from './components/thankyou';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thankyou" element={<Thankyou />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

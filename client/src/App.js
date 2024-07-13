import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WebSocketComponent from './components/websockets'; // Import the WebSocket component; 

function App(){
  return(
  <Router>
    <div>
        <WebSocketComponent /> {/* Add WebSocketComponent */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  </Router>
);
}
export default App;

import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/login', { username, password });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} placeholder="Enter your usernamme" onChange={(e) => setUsername(e.target.value)} required/>

        <label>Password:</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit">Login</button>
      </form>
      <div className="divmess">
          {message && <p className="message">{message}</p>}
      </div>
      
      
      <p><Link to="/verification">Verify Account</Link></p>
      <p>If you don't have an account <Link to="/register">REGISTER</Link></p>
    </div>
  );
};

export default Login;
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
        <input type="password" placeholder=" Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>If you don't have an account <Link to="/register">REGISTER</Link></p>
      <p><Link to="/verifyication">Verify Account</Link></p>
    </div>
  );
};

export default Login;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken } from '../utils/auth';
import './styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('userToken', token);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);

      if (trimmedCategory === 'seller') {
        navigate('/home');
      } else if (trimmedCategory === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/salespersonhome');
      }
    }
  }, [token, navigate]); // Include navigate as a dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/login', { username, password });
      setMessage(response.data.message);
      sessionStorage.setItem('userToken', response.data.token);
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('amount', response.data.amount);

      const category = response.data.category.trim().toLowerCase();
      if (category === 'seller') {
        sessionStorage.setItem('username', response.data.username);
        navigate('/home');
      } else if (category === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/salespersonhome');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  const handleRecoverPassword = () => {
    setRecoverPassword(!recoverpassword);
  };

  const sendRecovEmail = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/recoverpassword', { username });
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
      <form onSubmit={recoverpassword ? sendRecovEmail : handleSubmit}>
        {!recoverpassword ? (
          <div>
            <h2>Login</h2>
            <label>Username:</label>
            <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required/>

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
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit">Login</button>
            <button type="button" onClick={handleRecoverPassword}>Forgot Password</button>
            <p>Verify your account <Link to="/verification">Verify Account</Link></p>
            <p>If you don't have an account <Link to="/register">Register</Link></p>
          </div>
        ) : (
          <div>
            <h2>Recover password</h2>
            <label>Enter your username:</label>
            <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required/>
            <button type="submit">Recover password</button>
            <button type="button" onClick={handleRecoverPassword}>Back</button>
          </div>
        )}
      </form>
      <div className="divmess">
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;

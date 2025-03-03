import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken } from '../utils/auth';
import './styles/Login.css';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const apptoken = localStorage.getItem('apptoken');
  const appcat = localStorage.getItem('appcat');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If apptoken is set, use it to set the token and navigate based on the app category
    if (apptoken) {
      localStorage.setItem('token', apptoken);
      if (appcat) {
        switch (appcat.trim().toLowerCase()) {
          case 'agent':
            sessionStorage.setItem('username', getUsernameFromToken());
            navigate('/agentdash');
            break;
          default:
            setMessage('Failed to login, This is for Agents only.');
            break;
        }
      }
    }

    // If token exists, store user data and determine navigation
    if (token) {
      sessionStorage.setItem('userToken', token);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);
    }
  }, [apptoken, appcat, token, navigate]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('userToken', token);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/agent/login', {
        username: username.trim(),
        password,
      });
      setMessage(response.data.message);
      sessionStorage.setItem('userToken', response.data.token);
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('amount', response.data.amount);
      localStorage.setItem('apptoken', response.data.token);
      localStorage.setItem('appcat', response.data.category.trim().toLowerCase());
      setLoading(false);
      const category = response.data.category.trim().toLowerCase();
      if (category === 'agent')
      {
        sessionStorage.setItem('username', response.data.username);
        navigate('/agentdash');
      }else{
        setMessage('Failed to login, This is for Agents only.');
      }

    } catch (error) {
      setLoading(false);
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
    setLoading(true);
    try {
      const response = await axiosInstance.post('/agent/recoverpassword', { username });
      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex="0"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              
              </span>
            </div>
            <button type="submit">
              {loading ? 
                    <div className="spinne_r"></div>
                  : "Login"}  
            </button>
            <button type="button" onClick={handleRecoverPassword}>Forgot Password</button>
            <p>Verify your account <Link to="/agentVerification">Verify Account</Link></p>
            <p>If you don't have an account <Link to="/agentRegister">Register</Link></p>
          </div>
        ) : (
          <div>
            <h2>Recover password</h2>
            <label>Enter your username:</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit">
            {loading ? <div className="spinne_r"></div>: "Recover password"}  
            </button>
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

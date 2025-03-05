import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken, getcategoryFromToken, getToken } from '../utils/auth';
import './styles/Login.css';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);

  const ctoken = (Cookies.get('token') || getToken?.());
  const capptoken = (Cookies.get('apptoken') || getToken?.());
  const token = localStorage.getItem('token');
  const apptoken = localStorage.getItem('apptoken');

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {

    // If apptoken is set, use it to set the token and navigate based on the app category
    if (capptoken) {
      Cookies.set('token', capptoken, { expires: 1 });
      const appcat = (getcategoryFromToken?.())?.trim().toLowerCase();
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
    if (ctoken) {
      sessionStorage.setItem('userToken', ctoken);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);
    }
  }, [token, apptoken, capptoken,  ctoken, navigate]);

  useEffect(() => {
    if (ctoken) {
      sessionStorage.setItem('userToken', ctoken);
      const category = getcategoryFromToken();
      const trimmedCategory = category?.trim().toLowerCase(); // Add optional chaining for safety
      const storedUsername = getUsernameFromToken();
      sessionStorage.setItem('username', storedUsername);
    }
  }, [ctoken, navigate]);

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

      Cookies.set('token', response.data.token, { expires: 15 });
      Cookies.set('apptoken', response.data.token, { expires: 15 });
      Cookies.set('appcat', response.data.category.trim().toLowerCase(), { expires: 15 });
      sessionStorage.setItem('amount', response.data.amount);
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
          {!isInstalled &&
        (
          <div className="install-prompt">
            <p>Install this web app for a better experience.</p>
            <button onClick={handleInstall}>Install</button>
          </div>
        )
      };
      <form onSubmit={recoverpassword ? sendRecovEmail : handleSubmit}>
        {!recoverpassword ? (
          <div>
            <h2>Login</h2>
            <label>Business Name:</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your Business Name"
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

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
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const apptoken = localStorage.getItem('apptoken');
  const appcat = localStorage.getItem('appcat');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);

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
    if (apptoken) {
      localStorage.setItem('token', apptoken);
      if (appcat) {
        switch (appcat.trim().toLowerCase()) {
          case 'seller':
            alert('Failed to log in this app is for buyers only.');
            navigate('/logout');
            break;
          default:
            const currentpage = sessionStorage.getItem('currentpage');
            navigate(currentpage ? currentpage : '/');
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
    setError('');
    setloading(true);
    try {
      const response = await axiosInstance.post('/buyers/login', {
        username: username.trim(),
        password,
      });
      setMessage(response.data.message);
      sessionStorage.setItem('userToken', response.data.token);
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('amount', response.data.amount);
      localStorage.setItem('apptoken', response.data.token);
      localStorage.setItem('appcat', response.data.category.trim().toLowerCase());

    
      setloading(false);
      const category = response.data.category.trim().toLowerCase();
      if (category === 'seller') {
        alert('Failed to log in this app is for buyers only.');
      }else {
        const currentpage = sessionStorage.getItem('currentpage');
        navigate(currentpage ? currentpage : '/');
      }
    } catch (error) {
      setloading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while processing your request.');
      }
    }
  };

  const handleRecoverPassword = () => {
    setRecoverPassword(!recoverpassword);
  };

  const sendRecovEmail = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setloading(true);
    try {
      const response = await axiosInstance.post('/buyers/recoverpassword', { username });
      setMessage(response.data.message);
      setloading(false);
    } catch (error) {
      setloading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while processing your request.');
      }
    }
  };

  return (
    <div className="login-container">
          {!isInstalled &&
           (
              <div className="install-prompt">
                <p>Install this web app for a better experience.</p>
                <button onClick={handleInstall}>Install</button>
              </div>
            )
          };
          <div className='sidelarge'>
              <h2>Welcome back</h2>
             <img src="/logo(2).png" alt="App Logo" class="login-logo"></img>
            
          </div>
      <form onSubmit={recoverpassword ? sendRecovEmail : handleSubmit}>
        {!recoverpassword ? (
          <div>
            <div className='logside'>
            <h2>Login</h2>
             <img src="/logo(2).png" alt="App Logo" class="login-logo"></img>
            
            </div>

            <label>Username or Email:</label>
            <input
              type="text"
              value={username}
              placeholder="Username or Email"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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
                {showPassword ? <FaRegEyeSlash/> : <FaRegEye/>}
              </button>
            </div>
            <button type="submit">
            {loading ? "Loging..." : "Login"}
            </button>
            
            <button type="button" onClick={handleRecoverPassword}>Forgot Password</button>
            <p>Verify your account <Link to="/verification">Verify Account</Link></p>
            <p>If you don't have an account <Link to="/register">Register</Link></p>
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
            {loading ? "Recovering..." : "Recover password"}
              
            </button>
            <button type="button" onClick={handleRecoverPassword}>Back</button>
          </div>
        )}
              <div className="divmess">
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      </form>

    </div>
  );
};

export default Login;

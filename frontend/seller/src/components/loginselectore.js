import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/loginselector.css";
import { getUsernameFromToken, getcategoryFromToken, getToken } from "../utils/auth";
import Cookies from 'js-cookie';

const LoginPage = () => {
  const navigate = useNavigate();
 
  const token =  (Cookies.get('token') || getToken?.());
  const apptoken = Cookies.get('apptoken');
  const appcat = Cookies.get('appcat');
  
  useEffect(() => {
    const handleNavigation = (category) => {
      const username = getUsernameFromToken?.();
      if (username) {
        sessionStorage.setItem("username", username);
      }
  
      switch (category) {
        case "delivery person":
          navigate("/deliveryLogin");
          break;
        case "seller":
          navigate("/sellerlogin");
          break;
        case "agent":
          navigate("/agentLogin");
          break;
        default:
          alert("Failed to login. This platform is for delivery people, sellers, and agents only.");
          navigate('/logout');
      }
    };
  
    if (apptoken && !token) { // Avoid overwriting token if it's already set
      Cookies.set('token', apptoken, { expires: 1 });
    }
  
    const category = (appcat || getcategoryFromToken?.())?.trim().toLowerCase();
    if (category && apptoken ) {
      Cookies.set('token', apptoken, { expires: 1 });
      sessionStorage.setItem('userToken', apptoken);
      handleNavigation(category);
    }
  }, [apptoken, appcat, token, navigate]);
  
  return (
    <div className="log-container">
      <h1 className="log-header">Welcome Back</h1>
      <div className="log-options">
        <button
          className="log-btn log-seller-btn"
          onClick={() => navigate("/sellerlogin")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          Login as Seller
        </button>
        <button
          className="log-btn log-delivery-btn"
          onClick={() => navigate("/deliveryLogin")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 10h-6V4H9v6H3l9 9 9-9zm-8 8h-2v-6h2v6z" />
          </svg>
          Login as Delivery Person
        </button>
        <button
          className="log-btn log-agent-btn"
          onClick={() => navigate("/agentLogin")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.673 0-8 1.342-8 4v2h16v-2c0-2.658-5.327-4-8-4z" />
          </svg>
          Login as Agent
        </button>
      </div>
      <p className="log-link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")} className="log-register-link">
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;

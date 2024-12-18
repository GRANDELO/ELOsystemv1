import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/loginselector.css'; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();

  const handleAgentLogin = () => {
    navigate("/agentLogin");
    
  };

  const handleSellerLogin = () => {
    navigate("/sellerlogin");
    
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="log-container">
      <h1 className="log-header">Login</h1>
      <div className="log-options">
        <button className="log-btn log-agent-btn" onClick={handleAgentLogin}>
          Login as Agent
        </button>
        <button className="log-btn log-seller-btn" onClick={handleSellerLogin}>
          Login as Seller
        </button>
      </div>
      <p className="log-link">
        Don't have an account?{" "}
        <span onClick={goToRegister} className="log-register-link">
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;

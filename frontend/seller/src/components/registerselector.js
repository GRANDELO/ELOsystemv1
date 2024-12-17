import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/regselector.css'; // Import the CSS file


const RegistrationPage = () => {
  const navigate = useNavigate();

  const handleRegisterAsAgent = () => {
    navigate("/agentRegister");
  };

  const handleRegisterAsSeller = () => {
    navigate("/registerseller");
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="reg-container">
      <h1 className="reg-header">Register</h1>
      <div className="reg-options">
        <button className="reg-btn reg-agent-btn" onClick={handleRegisterAsAgent}>
          Register as Agent
        </button>
        <button className="reg-btn reg-seller-btn" onClick={handleRegisterAsSeller}>
          Register as Seller
        </button>
      </div>
      <p className="reg-link">
        Already have an account?{" "}
        <span onClick={goToLogin} className="reg-login-link">
          Login here
        </span>
      </p>
    </div>
  );
};

export default RegistrationPage;

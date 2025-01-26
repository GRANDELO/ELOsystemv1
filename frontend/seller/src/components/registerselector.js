import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/loginselector.css"; // Reuse the same CSS file

const RegistrationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="log-container">
      <h1 className="log-header">Register</h1>
      <div className="log-options">
        <button
          className="log-btn log-seller-btn"
          onClick={() => navigate("/registerseller")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          Register as Seller
        </button>
        <button
          className="log-btn log-delivery-btn"
          onClick={() => navigate("/deliveryRegister")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 10h-6V4H9v6H3l9 9 9-9zm-8 8h-2v-6h2v6z" />
          </svg>
          Register as Delivery Person
        </button>
        <button
          className="log-btn log-agent-btn"
          onClick={() => navigate("/agentRegister")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.673 0-8 1.342-8 4v2h16v-2c0-2.658-5.327-4-8-4z" />
          </svg>
          Register as Agent
        </button>
      </div>
      <p className="log-link">
        Already have an account?{" "}
        <span onClick={() => navigate("/")} className="log-register-link">
          Login here
        </span>
      </p>
    </div>
  );
};

export default RegistrationPage;

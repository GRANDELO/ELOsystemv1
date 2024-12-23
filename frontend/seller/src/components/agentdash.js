import React, { useState } from "react";

// Import your section components
import ReceiveBox from "./agentboxinput";
import ReceivePackage from "./agentinput";
import ViewPackage from "./agentboxdisp";
import Settings from "./Agentsettings";
import Withdrawal from "./agentwithdrawal";

const AgentDashboard = () => {
  const [activeSection, setActiveSection] = useState("receiveBox");

  return (
    <div className="dashboard-container">
      {/* Sidebar for navigation */}
      <nav className="dashboard-sidebar">
        <button onClick={() => setActiveSection("receiveBox")}>Receive Box</button>
        <button onClick={() => setActiveSection("receivePackage")}>Receive Package</button>
        <button onClick={() => setActiveSection("viewPackage")}>View Package</button>
        <button onClick={() => setActiveSection("settings")}>Settings</button>
        <button onClick={() => setActiveSection("withdrawal")}>Withdrawal</button>
      </nav>

      {/* Main content area */}
      <div className="dashboard-content">
        {activeSection === "receiveBox" && <ReceiveBox />}
        {activeSection === "receivePackage" && <ReceivePackage />}
        {activeSection === "viewPackage" && <ViewPackage />}
        {activeSection === "settings" && <Settings />}
        {activeSection === "withdrawal" && <Withdrawal />}
      </div>
    </div>
  );
};

export default AgentDashboard;

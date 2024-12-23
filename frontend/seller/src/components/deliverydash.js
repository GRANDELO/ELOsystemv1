import React, { useState } from "react";
import { getagentnoFromToken } from '../utils/auth';

// Import your section components
import ReceivePackage from "./deliveryaccept";
import ViewPackage from "./deliverydisp";
import Settings from "./deliverysettings";
import Withdrawal from "./deliverywithdrawal";

const AgentDashboard = () => {
  const [activeSection, setActiveSection] = useState("receivePackage");
    const username = getagentnoFromToken();
  return (
    <div className="dashboard-container">
      {/* Sidebar for navigation */}
      <nav className="dashboard-sidebar">
        <button onClick={() => setActiveSection("receivePackage")}>Receive Package</button>
        <button onClick={() => setActiveSection("viewPackage")}>View Package</button>
        <button onClick={() => setActiveSection("settings")}>Settings</button>
        <button onClick={() => setActiveSection("withdrawal")}>Withdrawal</button>
      </nav>

      {/* Main content area */}
      <div className="dashboard-content">
        {activeSection === "receivePackage" && <ReceivePackage />}
        {activeSection === "viewPackage" && <ViewPackage />}
        {activeSection === "settings" && <Settings />}
        {activeSection === "withdrawal" && <Withdrawal />}
      </div>
    </div>
  );
};

export default AgentDashboard;

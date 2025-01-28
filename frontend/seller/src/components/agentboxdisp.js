import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { getagentnoFromToken } from "../utils/auth";
import './styles/box.css';

const AgentBoxes = () => {
  const agentNumber = getagentnoFromToken();
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedBox, setExpandedBox] = useState(null);

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    setError("");
    setLoading(true);
    setBoxes([]);
    setExpandedBox(null);

    try {
      const response = await axiosInstance.get(
        `/agent/${agentNumber}/boxes`
      );
      setBoxes(response.data.boxes);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || err.response.data.message);
      } else {
        setError("Failed to fetch boxes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleBoxDetails = (boxId) => {
    setExpandedBox((prevBoxId) => (prevBoxId === boxId ? null : boxId));
  };

  return (
    <div className="agent-boxes-container">
      <h2 className="agent-boxes-title">Agent Boxes</h2>

      {error && <p className="error-message">{error}</p>}

      {loading && <p className="loading-message">Loading...</p>}

      {boxes.length > 0 && (
        <div className="box-list">
          <h3 className="subtitle">Boxes for Agent {agentNumber}:</h3>
          <ul className="box-list-items">
            {boxes.map((box) => (
              <li key={box._id} className="box-item">
                <div>
                  <strong>Box Number:</strong> {box.boxNumber} <br />
                  <strong>Box ID:</strong> {box.boxid} <br />
                  <strong>Destination:</strong> {box.destination} <br />
                  <strong>Current Place:</strong> {box.currentplace} <br />
                  <strong>Packing Date:</strong>{" "}
                  {new Date(box.packingDate).toLocaleString()} <br />
                  <strong>
                    Items:{" "}
                    <span
                      className="item-toggle"
                      onClick={() => toggleBoxDetails(box._id)}
                    >
                      {box.items.length} orders (click to view)
                    </span>
                  </strong>
                </div>

                {expandedBox === box._id && (
                  <div className="item-details">
                    <h4>Item Details:</h4>
                    <ul>
                      {box.items.map((item, index) => (
                        <li key={index} className="item-detail">
                          <strong>Item Order Number:</strong>{" "}
                          {item.orderNumber}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {boxes.length === 0 && !error && !loading && (
        <p className="no-data-message">No boxes available for this agent.</p>
      )}
    </div>
  );
};

export default AgentBoxes;

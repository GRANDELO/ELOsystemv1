import React, { useState } from "react";
import axios from "axios";
import { getagentnoFromToken } from '../utils/auth';

const AgentBoxes = () => {
  const agentNumber = getagentnoFromToken();
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedBox, setExpandedBox] = useState(null); // Tracks which box is expanded

  const fetchBoxes = async () => {
    setError("");
    setLoading(true);
    setBoxes([]);
    setExpandedBox(null);

    try {
      const response = await axios.get(`https://elosystemv1.onrender.com/api/agent/${agentNumber}/boxes`);
      setBoxes(response.data.boxes);
    } catch (err) {
      if (err.response) {
        // If the server responded with an error
        setError(err.response.data.error || err.response.data.message);
      } else {
        // Network or other errors
        setError("Failed to fetch boxes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleBoxDetails = (boxId) => {
    // Toggles the details of a specific box
    setExpandedBox((prevBoxId) => (prevBoxId === boxId ? null : boxId));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agent Boxes</h2>
      {error && <p style={styles.error}>{error}</p>}

      {boxes.length > 0 && (
        <div style={styles.boxList}>
          <h3 style={styles.subtitle}>Boxes for Agent {agentNumber}:</h3>
          <ul style={styles.boxListItems}>
            {boxes.map((box) => (
              <li key={box._id} style={styles.boxItem}>
                <div>
                  <strong>Box Number:</strong> {box.boxNumber} <br />
                  <strong>Box ID:</strong> {box.boxid} <br />
                  <strong>Destination:</strong> {box.destination} <br />
                  <strong>Current Place:</strong> {box.currentplace} <br />
                  <strong>Packing Date:</strong> {new Date(box.packingDate).toLocaleString()} <br />
                  <strong>
                    Items:{" "}
                    <span
                      style={styles.itemToggle}
                      onClick={() => toggleBoxDetails(box._id)}
                    >
                      {box.items.length} orders (click to view)
                    </span>
                  </strong>
                </div>

                {expandedBox === box._id && (
                  <div style={styles.itemDetails}>
                    <h4>Item Details:</h4>
                    <ul>
                      {box.items.map((item, index) => (
                        <li key={index} style={styles.itemDetail}>
                          <strong>Item Order Number:</strong> {item.orderNumber} <br />
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
        <p style={styles.noData}>No boxes available for this agent.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  boxList: {
    textAlign: "left",
    marginTop: "20px",
  },
  boxListItems: {
    listStyle: "none",
    padding: 0,
  },
  boxItem: {
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  itemToggle: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
  itemDetails: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#eef2f7",
  },
  itemDetail: {
    marginBottom: "10px",
  },
  noData: {
    color: "#666",
  },
};

export default AgentBoxes;

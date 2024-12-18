import React, { useState } from "react";
import axios from "axios";

const AgentBoxes = () => {
  const [agentNumber, setAgentNumber] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBoxes = async () => {
    setError("");
    setLoading(true);
    setBoxes([]);

    try {
      const response = await axios.get(`/api/agent/${agentNumber}/boxes`);
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agent Boxes</h2>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter Agent Number"
          value={agentNumber}
          onChange={(e) => setAgentNumber(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchBoxes} style={styles.button}>
          {loading ? "Loading..." : "Fetch Boxes"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {boxes.length > 0 && (
        <div style={styles.boxList}>
          <h3 style={styles.subtitle}>Boxes for Agent {agentNumber}:</h3>
          <ul style={styles.boxListItems}>
            {boxes.map((box) => (
              <li key={box._id} style={styles.boxItem}>
                <strong>Box Number:</strong> {box.boxNumber} <br />
                <strong>Destination:</strong> {box.destination} <br />
                <strong>Current Place:</strong> {box.currentplace} <br />
                <strong>Packing Date:</strong> {new Date(box.packingDate).toLocaleString()} <br />
                <strong>Items:</strong> {box.items.length} orders
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
  noData: {
    color: "#666",
  },
};

export default AgentBoxes;

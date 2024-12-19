import React, { useState } from "react";
import axios from "axios";

const AddOrderToAgent = () => {
  const [formData, setFormData] = useState({
    agentnumber: "",
    orderId: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Send POST request to backend
      const res = await axios.post("https://elosystemv1.onrender.com/api/agent/add-box", {
        agentnumber: formData.agentnumber,
        boxId: formData.orderId,
      });

      // Set response data
      setResponse(res.data);
    } catch (err) {
      // Handle errors
      setError(
        err.response && err.response.data
          ? err.response.data.error
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Add Order to Agent</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Agent Number:
          <input
            type="text"
            name="agentnumber"
            value={formData.agentnumber}
            onChange={handleChange}
            placeholder="Enter agent number"
            required
          />
        </label>
        <br />
        <label>
          Order ID:
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder="Enter order ID"
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Order"}
        </button>
      </form>

      {/* Display Response */}
      {response && (
        <div style={{ marginTop: "20px", color: "green", textAlign: "left" }}>
          <h3>Order Added Successfully:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AddOrderToAgent;

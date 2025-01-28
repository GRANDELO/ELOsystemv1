import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import { getagentnoFromToken } from '../utils/auth';

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
      const res = await axiosInstance.post("/agent/add-box", {
        agentnumber: getagentnoFromToken(),
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
    <div className="add-order-container">
     <h2>Add Box to Agent</h2>
     <form onSubmit={handleSubmit} >
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
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add box"}
        </button>
      </form>

    {/* Display Response */}
    {response && (
      <div className="response">
        <h3>Order Added Successfully:</h3>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    )}

    {/* Display Error */}
    {error && (
      <div className="error">
        <h3>Error:</h3>
        <p>{error}</p>
      </div>
    )}
    </div>
  );
};

export default AddOrderToAgent;

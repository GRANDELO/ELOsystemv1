import { useState } from "react";
import axiosInstance from "./axiosInstance"; // Custom Axios instance
import "./styles/returnForm.css"; // Import external CSS

const ReturnForm = () => {
  const [formData, setFormData] = useState({
    orderNumber: "",
    reason: "",
    condition: "",
    resolution: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  //const [setClose, showSetClose] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const rensponse =await axiosInstance.post("/returns", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Return request submitted successfully!");
      setFormData({
        orderNumber: "",
        reason: "",
        condition: "",
        resolution: "",
        comments: "",
      });
      console.log("error incurring", rensponse);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to submit return request."
      );
    } finally {
      setLoading(false);
    }
  };
   
  const onClose = () => {
    setIsModalOpen(false); 
  }

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="return-form-container">
        {/* Close Button */}
        <button className="btt-close" onClick={onClose}>Close</button>

        <h2 className="return-form-title">Return Request Form</h2>
        {message && <p className="return-message">{message}</p>}
        
        <form onSubmit={handleSubmit} className="return-form">
          <input
            type="text"
            name="orderNumber"
            placeholder="Order Number *"
            required
            value={formData.orderNumber}
            onChange={handleChange}
            className="return-input"
          />
          
          <select
            name="reason"
            required
            value={formData.reason}
            onChange={handleChange}
            className="return-select"
          >
            <option value="">Select a Reason *</option>
            <option value="damaged">Damaged Item</option>
            <option value="wrong_item">Wrong Item Sent</option>
            <option value="not_as_described">Not as Described</option>
          </select>

          <select
            name="condition"
            required
            value={formData.condition}
            onChange={handleChange}
            className="return-select"
          >
            <option value="">Condition of Item *</option>
            <option value="unopened">Unopened</option>
            <option value="opened">Opened but Unused</option>
            <option value="used">Used</option>
          </select>

          <select
            name="resolution"
            required
            value={formData.resolution}
            onChange={handleChange}
            className="return-select"
          >
            <option value="">Preferred Resolution *</option>
            <option value="refund">Refund</option>
            <option value="exchange">Exchange</option>
          </select>

          <textarea
            name="comments"
            placeholder="Additional Comments (optional)"
            value={formData.comments}
            onChange={handleChange}
            className="return-textarea"
          />

          <button type="submit" className="return-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Return Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReturnForm;
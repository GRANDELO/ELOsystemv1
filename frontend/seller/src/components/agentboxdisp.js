import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { getagentnoFromToken } from "../utils/auth";
import "./styles/box.css";

const AgentBoxes = () => {
  const agentNumber = getagentnoFromToken();
  const [boxes, setBoxes] = useState([]);
  const [orderPayments, setOrderPayments] = useState({});
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
      const response = await axiosInstance.get(`/agent/${agentNumber}/boxes`);
      setBoxes(response.data.boxes);
      fetchOrderPayments(response.data.boxes);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch boxes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderPayments = async (boxes) => {
    const payments = {};
    for (const box of boxes) {
      for (const item of box.items) {
        try {
          const response = await axiosInstance.get(`/orders/findOrderByProductId/${item.productId}`);
          payments[item.orderNumber] = response.data;
        } catch (error) {
          console.error(`Failed to fetch payment info for order ${item.orderNumber}`);
        }
      }
    }
    setOrderPayments(payments);
  };

  const toggleBoxDetails = (boxId) => {
    setExpandedBox((prevBoxId) => (prevBoxId === boxId ? null : boxId));
  };

  const extractDestination = (destinationString) => {
    try {
      const validJsonString = destinationString
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');

      const destinationObj = JSON.parse(validJsonString);
      const { county, town, area, specific } = destinationObj;

      return { county, town, area, specific };
    } catch (error) {
      console.error("Error parsing destination string:", error);
      return { county: null, town: null, area: null, specific: null };
    }
  };

  const categorizeBoxes = (boxes) => {
    const locallyDelivered = [];
    const toBePickedUp = [];
    const toHub = [];

    boxes.forEach((box) => {
      const { county, town, area, specific } = extractDestination(box.destination);
      const currentParts = box.currentplace.split(", ");

      if (currentParts[0] === county && currentParts[1] === town && currentParts[2] === area) {
        if (currentParts[3] === specific) {
          toBePickedUp.push(box);
        } else {
          locallyDelivered.push(box);
        }
      } else {
        toHub.push(box);
      }
    });

    return { locallyDelivered, toBePickedUp, toHub };
  };

  const { locallyDelivered, toBePickedUp, toHub } = categorizeBoxes(boxes);

  const renderBoxSection = (title, boxList) => (
    <>
      {boxList.length > 0 && (
        <div className="box-section">
          <h3 className="box-section-title">{title}</h3>
          <ul className="box-list-items">
            {boxList.map((box) => (
              <li key={box._id} className="box-item">
                <div>
                  <strong>Box Number:</strong> {box.boxNumber} <br />
                  <strong>Box ID:</strong> {box.boxid} <br />
                  <strong>Destination:</strong> {box.destination}<br />
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
                      {box.items.map((item, index) => {
                        const orderInfo = orderPayments[item.orderNumber] || {};
                        const paid = orderInfo.paid;
                        return (
                          <li
                            key={index}
                            className={`item-detail ${paid ? "paid" : "unpaid"}`}
                          >
                            <strong>Item Order Number:</strong> {item.orderNumber} <br />
                            <strong>Username:</strong> {orderInfo.username || "N/A"} <br />
                            <strong>Amount:</strong> {orderInfo.totalPrice || "N/A"} <br />
                            <strong>Status:</strong> {paid ? "Paid ✅" : "Unpaid ❌"}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <div className="agent-boxes-container">
      <h2 className="agent-boxes-title">Agent Boxes</h2>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      {!loading && !error && boxes.length === 0 && (
        <p className="no-data-message">No boxes available for this agent.</p>
      )}

      {renderBoxSection("Locally Delivered", locallyDelivered)}
      {renderBoxSection("To Be Picked Up", toBePickedUp)}
      {renderBoxSection("To Hub", toHub)}
    </div>
  );
};

export default AgentBoxes;

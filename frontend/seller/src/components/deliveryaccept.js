import React, { useState } from 'react';
import axios from 'axios';
import { getdpnoFromToken } from '../utils/auth';
import './styles/input.css';

const AssignBox = () => {
  const deliveryPersonnumber = getdpnoFromToken();
  const [boxId, setBoxId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleAssignBox = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/delivery/acceptpackage', {
        deliveryPersonnumber,
        boxId,
      });

      if (response.data.success) {
        setResponseMessage(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while assigning the box.');
    }
  };

  return (
    <div className="add-order-container">
      <h2>Assign Box to Delivery Person</h2>
      <form onSubmit={handleAssignBox}>
        <div>
          <label htmlFor="boxId">Box ID</label>
          <input
            type="text"
            id="boxId"
            value={boxId}
            onChange={(e) => setBoxId(e.target.value)}
            placeholder="Enter Box ID"
            required
          />
        </div>
        <button type="submit">Assign Box</button>
      </form>
      {responseMessage && (
        <div className="response">
          <h3>Success!</h3>
          <pre>{responseMessage}</pre>
        </div>
      )}
      {error && (
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AssignBox;

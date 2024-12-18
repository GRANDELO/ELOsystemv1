import React, { useState } from 'react';
import axios from 'axios';

const AssignBox = () => {
  const [deliveryPersonnumber, setDeliveryPersonnumber] = useState('');
  const [boxId, setBoxId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleAssignBox = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');

    try {
      // API call to assign the box
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
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Assign Box to Delivery Person</h2>
      <form onSubmit={handleAssignBox}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="deliveryPersonnumber">Delivery Person Number</label>
          <input
            type="text"
            id="deliveryPersonnumber"
            value={deliveryPersonnumber}
            onChange={(e) => setDeliveryPersonnumber(e.target.value)}
            placeholder="Enter Delivery Person Number"
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="boxId">Box ID</label>
          <input
            type="text"
            id="boxId"
            value={boxId}
            onChange={(e) => setBoxId(e.target.value)}
            placeholder="Enter Box ID"
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Assign Box
        </button>
      </form>
      {responseMessage && (
        <p style={{ color: 'green', marginTop: '15px' }}>{responseMessage}</p>
      )}
      {error && (
        <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>
      )}
    </div>
  );
};

export default AssignBox;

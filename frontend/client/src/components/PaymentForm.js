import axios from 'axios';
import React, { useState } from 'react';

const PaymentForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Send data to your Node.js backend
      const response = await axios.post('http://localhost:5000/api/stkpush', {
        phoneNumber,
        amount
      });
      
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay with MPesa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="2547xxxxxxxx"
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;

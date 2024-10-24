// src/Payment.js
import axios from 'axios';
import React, { useState } from 'react';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:your_backend_port/api/stkPush', {
        amount,
        phone,
        Order_ID: orderId,
      });

      setResponseMessage(`Payment Initiated: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error(error);
      setResponseMessage('Error initiating payment.');
    }
  };

  return (
    <div>
      <h2>M-Pesa STK Push Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Pay with M-Pesa</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Payment;

import axios from 'axios';
import React, { useState } from 'react';

const RegisterDeliveryPersonnel = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('available'); // Default status can be set to 'available'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/delivery-personnel', {
        name,
        phone,
        status,
      });

      // Handle success
      setSuccess('Delivery personnel registered successfully!');
      console.log('Response:', response.data);
      // Optionally reset the form
      setName('');
      setPhone('');
      setStatus('available');
    } catch (err) {
      setError('Failed to register delivery personnel: ' + err.response.data.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register Delivery Personnel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RegisterDeliveryPersonnel;

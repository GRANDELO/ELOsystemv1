import React, { useState } from 'react';
import axios from 'axios';

const AccountForm = ({ fetchAccounts }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://elosystemv1.onrender.com/api/accounts', { name, type });
      fetchAccounts();
      setName('');
      setType('');
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Account Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Account Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Account Type</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
};

export default AccountForm;

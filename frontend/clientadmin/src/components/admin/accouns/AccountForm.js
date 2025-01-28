import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import '../styles/accform.css';

const AccountForm = ({ fetchAccounts }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/accounts', { name, type });
      fetchAccounts();
      setName('');
      setType('');
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="accountName">Account Name:</label>
        <input
          id="accountName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="accountType">Account Type:</label>
        <select
          id="accountType"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select Account Type</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <button type="submit" className="submit-button">
        Create Account
      </button>
    </form>
  );
};

export default AccountForm;

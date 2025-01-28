import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import '../styles/TransactionForm.css'; // Assuming you'll create this CSS file

const TransactionForm = ({ fetchTransactions }) => {
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get('/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/transactions', { 
        description, accountId, debit, credit 
      });
      fetchTransactions();
      setDescription('');
      setAccountId('');
      setDebit(0);
      setCredit(0);
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Create Transaction</h3>
      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter transaction description"
          required
        />
      </div>
      <div className="form-group">
        <label>Account:</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          <option value="">Select Account</option>
          {(accounts || []).map((account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Debit:</label>
        <input
          type="number"
          value={debit}
          onChange={(e) => setDebit(e.target.value)}
          placeholder="Enter debit amount"
        />
      </div>
      <div className="form-group">
        <label>Credit:</label>
        <input
          type="number"
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          placeholder="Enter credit amount"
        />
      </div>
      <button type="submit" className="submit-btn">Create Transaction</button>
    </form>
  );
};

export default TransactionForm;

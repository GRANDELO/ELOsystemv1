import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ fetchTransactions }) => {
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/accounts');
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
        const response = await axios.get('https://elosystemv1.onrender.com/api/accounts');
        setAccounts(response.data);

      await axios.post('https://elosystemv1.onrender.com/api/transactions', { description, accountId, debit, credit });
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Account:</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          <option value="">Select Account</option>
          {(accounts || []).map((account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Debit:</label>
        <input
          type="number"
          value={debit}
          onChange={(e) => setDebit(e.target.value)}
        />
      </div>
      <div>
        <label>Credit:</label>
        <input
          type="number"
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
        />
      </div>
      <button type="submit">Create Transaction</button>
    </form>
  );
};

export default TransactionForm;

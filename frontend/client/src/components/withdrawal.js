// src/Withdrawal.js
import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utils/auth';
import './styles/setting.css';

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [Phonenumber, setPhoneNumber] = useState('');
  const [transactions, setTransactions] = useState([]);
  const username = getUsernameFromToken(); // Hardcoded username

  // Fetch withdrawals for the user when component loads
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/withdraw/withdrawals/${username}`);
        setTransactions(response.data.withdrawals);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchWithdrawals();
  }, []);

  // Handle withdrawal request submission
  const handleWithdraw = async (e) => {
    e.preventDefault();

    // Validate phone number and amount
    if (!/^2547\d{8}$/.test(Phonenumber)) {
      alert('Phone number must start with 2547 and be 12 digits long.');
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      // Send withdrawal request to backend
      const response = await axios.post('https://elosystemv1.onrender.com/api/withdraw', {
        username,
        Phonenumber,
        amount: Number(amount),
      });
      alert(response.data.message);
      
      // Update transactions list to include the new transaction
      setTransactions(prev => [...prev, {
        username,
        amount: Number(amount),
        time: new Date().toISOString(),
        balance: response.data.newBalance,
      }]);
      
      // Clear input fields
      setPhoneNumber('');
      setAmount('');
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  // Download transaction history as CSV
  const downloadCSV = () => {
    let csv = 'Username,Amount,Time,Balance\n';
    transactions.forEach(t => {
      csv += `${t.username},${t.amount},${new Date(t.time).toLocaleString()},${t.balance}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${username}_transactions.csv`);
  };

  return (
    <div className="witda-withdrawal">
      <h1 className="wit-title">Withdrawal System</h1>

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="wit-form">
        <label className="witda-label">
          Phone Number:
          <input
            type="text"
            value={Phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="2547xxxxxxxx"
            required
            className="wit-input"
          />
        </label>
        <br />
        <label className="witda-label">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            className="wit-input"
          />
        </label>
        <br />
        <button type="submit" className="witda-submit-btn">Withdraw</button>
      </form>

      {/* Transaction History and CSV Download */}
      <div className="witda-transaction-history">
        <h2 className="wit-subtitle">Transaction History</h2>
        <button onClick={downloadCSV} className="witda-download-btn">Download CSV</button>
      </div>
    </div>
  );
};

export default Withdrawal;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrialBalance.css'; // Import the CSS file for styling

const TrialBalance = () => {
  const [trialBalance, setTrialBalance] = useState([]);
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isBalanced, setIsBalanced] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch trial balance from the backend
  const fetchTrialBalance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trial-balance'); // Adjust API URL as needed
      const { trialBalance, totalDebits, totalCredits, isBalanced, message } = response.data;

      setTrialBalance(trialBalance);
      setTotalDebits(totalDebits);
      setTotalCredits(totalCredits);
      setIsBalanced(isBalanced);
      setMessage(message);
    } catch (err) {
      console.error('Error fetching trial balance:', err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTrialBalance();
  }, []);

  return (
    <div className="trial-balance-container">
      <h2>Trial Balance</h2>
      <p>{message}</p>

      <table className="trial-balance-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Account Type</th>
            <th>Total Debit</th>
            <th>Total Credit</th>
          </tr>
        </thead>
        <tbody>
          {trialBalance.map((account) => (
            <tr key={account._id}>
              <td>{account.accountName}</td>
              <td>{account.accountType}</td>
              <td>{account.totalDebit.toFixed(2)}</td>
              <td>{account.totalCredit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Totals</td>
            <td>{totalDebits.toFixed(2)}</td>
            <td>{totalCredits.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="4" className={isBalanced ? 'balanced' : 'not-balanced'}>
              {isBalanced ? 'Balanced' : 'Not Balanced'}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TrialBalance;

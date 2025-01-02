import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TrialBalance.css';

const TrialBalance = () => {
  const [trialBalance, setTrialBalance] = useState([]);
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isBalanced, setIsBalanced] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTrialBalance = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/transactions/trialbalance');
      if (response.data) {
        const { trialBalance = [], totalDebits = 0, totalCredits = 0, isBalanced = false, message = '' } = response.data;
  
        setTrialBalance(trialBalance);
        setTotalDebits(parseFloat(totalDebits));
        setTotalCredits(parseFloat(totalCredits));
        setIsBalanced(isBalanced);
        setMessage(message);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Error fetching trial balance:', err);
      setMessage('Failed to load trial balance. Please check the backend or try again later.');
      setTrialBalance([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  if (loading) {
    return <p>Loading trial balance...</p>;
  }

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
            <tr key={account._id || account.accountName}>
              <td>{account.accountName}</td>
              <td>{account.accountType}</td>
              <td>{account.totalDebit?.toFixed(2) || '0.00'}</td>
              <td>{account.totalCredit?.toFixed(2) || '0.00'}</td>
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

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
      const response = await axios.get(
        'https://elosystemv1.onrender.com/api/transactions/trialbalance'
      );

      if (response.data) {
        const {
          trialBalance = [],
          totalDebits = 0,
          totalCredits = 0,
          isBalanced = false,
          message = '',
        } = response.data;

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
      setMessage(
        'Failed to load trial balance. Please check the backend or try again later.'
      );
      setTrialBalance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Trial Balance</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Account Type</th>
            <th>Debits</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {trialBalance.map((entry, index) => (
            <tr key={index}>
              <td>{entry.accountName}</td>
              <td>{entry.accountType}</td>
              <td>{entry.totalDebit.toFixed(2)}</td>
              <td>{entry.totalCredit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Debits: {totalDebits.toFixed(2)}</h3>
      <h3>Total Credits: {totalCredits.toFixed(2)}</h3>
      <h3>Status: {isBalanced ? 'Balanced' : 'Not Balanced'}</h3>
    </div>
  );
};

export default TrialBalance;

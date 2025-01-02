import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const fetchAllTransactions = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    if (accountId) {
      // Filter transactions by accountId
      const filtered = transactions.filter((transaction) => transaction.accountId === accountId);
      setFilteredTransactions(filtered);
    } else {
      // Show all transactions if no accountId is selected
      setFilteredTransactions(transactions);
    }
  }, [accountId, transactions]);

  return (
    <div>
      <h3>Transactions</h3>
      {filteredTransactions.length > 0 ? (
        <ul>
          {filteredTransactions.map((transaction) => (
            <li key={transaction._id}>
              {transaction.description} - Debit: {transaction.debit} - Credit: {transaction.credit}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions available.</p>
      )}
    </div>
  );
};

export default TransactionList;

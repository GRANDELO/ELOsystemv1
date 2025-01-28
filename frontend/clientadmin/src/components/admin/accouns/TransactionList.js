import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import '../styles/AccountTransactionSystem.css'; // Import the CSS file

const AccountTransactionSystem = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch all accounts from the API
  const fetchAccounts = async () => {
    try {
      const { data } = await axiosInstance.get('/accounts');
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  // Fetch transactions for a specific account
  const fetchTransactions = async (accountId) => {
    try {
      const { data } = await axiosInstance.get(`/transactions/${accountId}`);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Handle account selection
  const handleAccountClick = (accountId) => {
    setSelectedAccountId(accountId);
    fetchTransactions(accountId);
  };

  // Format the date into a readable format (e.g., MM/DD/YYYY)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Fetch accounts when the component is mounted
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="container">
      <h2 className="header">Accounts and Transactions</h2>

      {/* List of Accounts */}
      <div className="section">
        <h3 className="section-header">Accounts</h3>
        <ul className="list">
          {accounts.length ? (
            accounts.map((account) => (
              <li
                key={account._id}
                onClick={() => handleAccountClick(account._id)}
                className="list-item"
              >
                <span className="account-name">{account.name}</span>
                <span className="account-type">({account.type})</span>
              </li>
            ))
          ) : (
            <p className="no-data-text">No accounts available. Please add accounts to view them here.</p>
          )}
        </ul>
      </div>

      {/* Transactions for the Selected Account */}
      <div className="section">
        {selectedAccountId ? (
          <>
            <h3 className="section-header">
              Transactions for Account: {accounts.find((acc) => acc._id === selectedAccountId)?.name}
            </h3>
            {transactions.length ? (
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.debit}</td>
                      <td>{transaction.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data-text">No transactions found for this account.</p>
            )}
          </>
        ) : (
          <p className="select-account-text">Select an account to view its transactions.</p>
        )}
      </div>
    </div>
  );
};

export default AccountTransactionSystem;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountList.css'; // Assuming you'll create this CSS file

const AccountList = () => {
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

  return (
    <div className="account-list-container">
      <h3 className="account-list-title">Accounts</h3>
      <ul className="account-list">
        {accounts.map((account) => (
          <li key={account._id} className="account-list-item">
            <span className="account-name">{account.name}</span>
            <span className="account-type">({account.type})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;

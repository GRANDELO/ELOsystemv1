import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h3>Accounts</h3>
      <ul>
        {accounts.map((account) => (
          <li key={account._id}>
            {account.name} ({account.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;

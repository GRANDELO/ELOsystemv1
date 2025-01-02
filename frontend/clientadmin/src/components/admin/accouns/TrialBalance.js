import React, { useEffect, useState } from "react";

function TrialBalance() {
  const [trialBalance, setTrialBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trial balance data from the backend
    fetch("https://elosystemv1.onrender.com/api/transactions/trial-balance")
      .then((response) => response.json())
      .then((data) => {
        setTrialBalance(data);  // Set the data to the state
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching trial balance");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Trial Balance</h1>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Total Debit</th>
            <th>Total Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {trialBalance.map((entry) => (
            <tr key={entry.account}>
              <td>{entry.account}</td>
              <td>{entry.totalDebit}</td>
              <td>{entry.totalCredit}</td>
              <td>{entry.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrialBalance;

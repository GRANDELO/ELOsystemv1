// TransactionDetails.js
import React from 'react';

const TransactionDetails = ({ summary }) => (
  <div className="sal-details">
    <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
    <p><strong>Average Income per Transaction:</strong> {summary.avgIncome.toLocaleString()}</p>
    <p><strong>Average Expenses per Transaction:</strong> {summary.avgExpenses.toLocaleString()}</p>
    <p><strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleString()}</p>
  </div>
);

export default TransactionDetails;

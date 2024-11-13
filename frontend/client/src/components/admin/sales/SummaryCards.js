// SummaryCards.js
import React from 'react';

const SummaryCards = ({ summary }) => (
  <div className="sal-summary-cards">
    <div className="sal-card">
      <h3>Total Income</h3>
      <p className="sal-amount">{summary.totalIncome.toLocaleString()}</p>
    </div>
    <div className="sal-card">
      <h3>Total Expenses</h3>
      <p className="sal-amount">{summary.totalExpenses.toLocaleString()}</p>
    </div>
    <div className="sal-card">
      <h3>Net Balance</h3>
      <p className={`sal-amount ${summary.netBalance >= 0 ? 'sal-positive' : 'sal-negative'}`}>
        {summary.netBalance.toLocaleString()}
      </p>
    </div>
  </div>
);

export default SummaryCards;

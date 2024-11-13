import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/sales.css';
const FinancialSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/financials/summary');
        setSummary(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching financial data');
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading financial data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="sal-container">
      <h2 className="sal-header">Financial Summary</h2>
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

      <h3 className="sal-subheader">Monthly Sales</h3>
      <table className="sal-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expenses</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary.monthlySales).map(([month, data]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{data.income.toLocaleString()}</td>
              <td>{data.expenses.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sal-details">
        <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
        <p><strong>Average Income per Transaction:</strong> {summary.avgIncome.toLocaleString()}</p>
        <p><strong>Average Expenses per Transaction:</strong> {summary.avgExpenses.toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FinancialSummary;

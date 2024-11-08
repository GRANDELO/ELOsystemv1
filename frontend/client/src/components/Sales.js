import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
    <div>
      <h2>Financial Summary</h2>
      <p><strong>Total Income:</strong> {summary.totalIncome}</p>
      <p><strong>Total Expenses:</strong> {summary.totalExpenses}</p>
      <p><strong>Net Balance:</strong> {summary.netBalance}</p>
      <h3>Monthly Sales:</h3>
      <ul>
        {Object.entries(summary.monthlySales).map(([month, data]) => (
          <li key={month}>
            <strong>{month}</strong> - Income: {data.income}, Expenses: {data.expenses}
          </li>
        ))}
      </ul>
      <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
      <p><strong>Average Income per Transaction:</strong> {summary.avgIncome}</p>
      <p><strong>Average Expenses per Transaction:</strong> {summary.avgExpenses}</p>
      <p><strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleString()}</p>
    </div>
  );
};

export default FinancialSummary;

import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './styles/sales.css';

const FinancialSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get('/financials/summary');
        setSummary(response.data);
      } catch (error) {
        setError('Error fetching financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading financial data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="sal-container">
      <h2 className="sal-title">Financial Summary</h2>
      
      {summary && (
        <div className="sal-metrics">
          <p><strong>Total Income:</strong> ${summary.totalIncome?.toLocaleString() || 0}</p>
          <p><strong>Total Expenses:</strong> ${summary.totalExpenses?.toLocaleString() || 0}</p>
          <p><strong>Net Balance:</strong> ${summary.netBalance?.toLocaleString() || 0}</p>
          <p><strong>Total Transactions:</strong> {summary.totalTransactions || 0}</p>
          <p><strong>Average Income per Transaction:</strong> ${summary.avgIncome?.toFixed(2) || 0}</p>
          <p><strong>Average Expenses per Transaction:</strong> ${summary.avgExpenses?.toFixed(2) || 0}</p>
          <p><strong>Last Updated:</strong> {summary.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : "N/A"}</p>
        </div>
      )}

      <FinancialCharts monthlySales={summary?.monthlySales || []} />
    </div>
  );
};

const FinancialCharts = ({ monthlySales }) => {
  if (!Array.isArray(monthlySales) || monthlySales.length === 0) {
    return <p>No sales data available for display.</p>;
  }

  const incomeExpenseData = {
    labels: monthlySales.map((month) => month.name || "Unknown Month"),
    datasets: [
      {
        label: 'Income',
        data: monthlySales.map((month) => month.income || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: monthlySales.map((month) => month.expenses || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ],
  };

  const netBalanceData = {
    labels: monthlySales.map((month) => month.name || "Unknown Month"),
    datasets: [
      {
        label: 'Net Balance',
        data: monthlySales.map((month) => (month.income || 0) - (month.expenses || 0)),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      }
    ],
  };

  return (
    <div className="sal-charts">
      <h3>Monthly Income vs. Expenses</h3>
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '400px', margin: 'auto' }}>
        <Bar data={incomeExpenseData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      
      <h3>Net Balance Trend</h3>
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '400px', margin: 'auto' }}>
        <Line data={netBalanceData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default FinancialSummary;

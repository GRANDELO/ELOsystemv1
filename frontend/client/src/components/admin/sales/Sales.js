import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/sales.css';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FinancialSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ month: '', year: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch financial summary data
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/financials/summary');
        setSummary(response.data);
      } catch (error) {
        const errorMessage = error.response?.status === 404 
          ? 'Financial data not found' 
          : 'Error fetching financial data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Filter sales data based on selected month/year
  const filteredSales = Object.entries(summary?.monthlySales || {}).filter(([monthYear]) => {
    const [year, month] = monthYear.split('-');
    return (!filters.month || month === filters.month) && (!filters.year || year === filters.year);
  });

  // Chart data configuration
  const chartData = {
    labels: filteredSales.map(([month]) => month),
    datasets: [
      {
        label: 'Income',
        data: filteredSales.map(([, data]) => data.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Expenses',
        data: filteredSales.map(([, data]) => data.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Function to export summary data as JSON
  const handleExport = () => {
    const fileContent = JSON.stringify(summary, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    saveAs(blob, `Financial_Summary_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}.json`);
  };

  // Helper function to render summary cards
  const renderSummaryCard = (title, amount, isNetBalance = false) => (
    <div className="sal-card">
      <h3>{title}</h3>
      <p className={`sal-amount ${isNetBalance ? (amount >= 0 ? 'sal-positive' : 'sal-negative') : ''}`}>
        {amount.toLocaleString()}
      </p>
    </div>
  );

  // Loading, error, and rendering state handling
  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="sal-container">
      <h2 className="sal-header">Financial Summary</h2>

      {/* Filters */}
      <div className="sal-filters">
        <label>
          Month:
          <input
            type="text"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          />
        </label>
        <label>
          Year:
          <input
            type="text"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
        </label>
        <label>
          Select Month/Year:
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </label>
      </div>

      {/* Summary Cards */}
      <div className="sal-summary-cards">
        {renderSummaryCard('Total Income', summary.totalIncome)}
        {renderSummaryCard('Total Expenses', summary.totalExpenses)}
        {renderSummaryCard('Net Balance', summary.netBalance, true)}
      </div>

      {/* Filtered Monthly Sales Table */}
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
          {filteredSales.map(([month, data]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{data.income.toLocaleString()}</td>
              <td>{data.expenses.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Transaction Details */}
      <div className="sal-details">
        <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
        <p><strong>Average Income per Transaction:</strong> {summary.avgIncome.toLocaleString()}</p>
        <p><strong>Average Expenses per Transaction:</strong> {summary.avgExpenses.toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleString()}</p>
      </div>

      {/* Export Button */}
      <button onClick={handleExport} className="sal-export-btn">Export Financial Data</button>

      {/* Financial Trend Chart */}
      <div className="sal-chart">
        <h3>Financial Trend</h3>
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Income and Expenses Over Time' },
          },
        }} />
      </div>
    </div>
  );
};

export default FinancialSummary;

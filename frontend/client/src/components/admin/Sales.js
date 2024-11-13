import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // For charts
import DatePicker from 'react-datepicker'; // For date selection
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/sales.css';

const FinancialSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initial date is the current month

  // Fetch summary data with date filter
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/financials/summary?year=${year}&month=${month}`);
        setSummary(response.data);
      } catch (error) {
        setError('Error fetching financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [selectedDate]);

  // Export summary as CSV
  const exportSummary = () => {
    const csvData = [
      ["Month", "Income", "Expenses"],
      ...Object.entries(summary.monthlySales).map(([month, data]) => [month, data.income, data.expenses])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "financial_summary.csv");
  };

  if (loading) return <p>Loading financial data...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for chart visualization
  const chartData = {
    labels: Object.keys(summary.monthlySales),
    datasets: [
      {
        label: "Income",
        data: Object.values(summary.monthlySales).map(s => s.income),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false
      },
      {
        label: "Expenses",
        data: Object.values(summary.monthlySales).map(s => s.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false
      }
    ]
  };

  return (
    <div className="sal-container">
      <h2 className="sal-header">Financial Summary</h2>

      {/* Date Picker for filtering */}
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="MM/yyyy"
        showMonthYearPicker
      />

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

      {/* Chart Display */}
      <h3 className="sal-subheader">Monthly Sales Trend</h3>
      <Line data={chartData} />

      {/* Detailed Monthly Table */}
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

      {/* Export button */}
      <button onClick={exportSummary} className="sal-export-button">Export CSV</button>
    </div>
  );
};

export default FinancialSummary;

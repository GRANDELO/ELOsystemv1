import axios from 'axios';
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
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../header';
import '../../styles/sales.css';
import Setting from '../settings';
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
  const [visibleSection, setVisibleSection] = useState('summary'); // Track which section is visible
  const navigate = useNavigate();

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


  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Date picker change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilters({
      month: (date.getMonth() + 1).toString().padStart(2, '0'), // Format to "MM"
      year: date.getFullYear().toString(),
    });
  };

  
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

  const handleLogout = () => {
      navigate('/admnLogout');
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
            <Header/>
            <Setting/>
      <h2 className="sal-header">Financial Summary</h2>
      {/*<button onClick={() => setVisibleSection('filters')}>Filters</button>*/}
      <button onClick={() => setVisibleSection('summary')}>Summary Cards</button>
      <button onClick={() => setVisibleSection('monthlySales')}>Monthly Sales</button>
      <button onClick={() => setVisibleSection('transactions')}>Transaction Details</button>
      <button onClick={() => setVisibleSection('chart')}>Financial Trend</button>

      {/* Filters Section */}
      <div className="sal-section">
        {visibleSection === 'filters' && (
          <div className="sal-filters">
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
        )}
      </div>

      {/* Summary Cards Section */}
      <div className="sal-section">
        
        {visibleSection === 'summary' && (
          <div className="sal-summary-cards">
            {renderSummaryCard('Total Income', summary.totalIncome)}
            {renderSummaryCard('Total Expenses', summary.totalExpenses)}
            {renderSummaryCard('Net Balance', summary.netBalance, true)}
          </div>
        )}
      </div>

      {/* Monthly Sales Table Section */}
      <div className="sal-section">
        {visibleSection === 'monthlySales' && (
          <div className="filter-selects">
            <label>
              Month:
              <select name="month" onChange={handleFilterChange} value={filters.month}>
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </label>
            <label>
              Year:
              <select name="year" onChange={handleFilterChange} value={filters.year}>
                <option value="">All Years</option>
                {Object.keys(summary?.monthlySales || {}).map((monthYear) => {
                  const [year] = monthYear.split('-');
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </label>

            {/*
            
            <label>
              Year:
              <select name="year" onChange={handleFilterChange} value={filters.year}>
                <option value="">All Years</option>
                {Object.keys(summary?.monthlySales || {}).map((monthYear) => {
                  const [year] = monthYear.split('-');
                  return <option key={year} value={year}>{year}</option>;
                })}
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </label>

            */}
            <>
                {filteredSales.length > 0 ? (
                  <div className="sal-monthly-cards">
                    {filteredSales.map(([monthYear, data]) => (
                      <div key={monthYear} className="sal-card">
                        <h3>{monthYear}</h3>
                        <p><strong>Income:</strong> {data.income.toLocaleString()}</p>
                        <p><strong>Expenses:</strong> {data.expenses.toLocaleString()}</p>
                        <p><strong>Net Balance:</strong> <span className={data.income - data.expenses >= 0 ? 'sal-positive' : 'sal-negative'}>
                          {(data.income - data.expenses).toLocaleString()}
                        </span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No sales data available for the selected filters.</p>
                )}
              </>
          </div>
          
        )}
      </div>

      {/* Transaction Details Section */}
      <div className="sal-section">

        {visibleSection === 'transactions' && (
          <div className="sal-details">
            <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
            <p><strong>Average Income per Transaction:</strong> {summary.avgIncome.toLocaleString()}</p>
            <p><strong>Average Expenses per Transaction:</strong> {summary.avgExpenses.toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Financial Trend Chart Section */}
      <div className="sal-section">
        
        {visibleSection === 'chart' && (
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
        )}
      </div>

      {/* Export Button */}
      <div className="sal-section">
        <button onClick={handleExport} className="sal-export-btn">Export Financial Data</button>
      </div>
    </div>
  );
};

export default FinancialSummary;

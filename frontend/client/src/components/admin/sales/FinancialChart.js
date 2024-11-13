import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../styles/sales.css';
import FilterControls from './FilterControls';
import FinancialChart from './FinancialChart';
import MonthlySalesTable from './MonthlySalesTable';
import SummaryCards from './SummaryCards';
import TransactionDetails from './TransactionDetails';

const FinancialSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ month: '', year: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState('summary'); // Control visible section

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/financials/summary');
        setSummary(response.data);
      } catch (error) {
        setError(error.response && error.response.status === 404 ? 'Financial data not found' : 'Error fetching financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const filteredSales = Object.entries(summary?.monthlySales || {}).filter(([monthYear]) => {
    const [year, month] = monthYear.split('-');
    return (
      (!filters.month || month === filters.month) &&
      (!filters.year || year === filters.year)
    );
  });

  const chartData = {
    labels: filteredSales.map(([month]) => month),
    datasets: [
      {
        label: 'Income',
        data: filteredSales.map(([, data]) => data.income || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Expenses',
        data: filteredSales.map(([, data]) => data.expenses || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="sal-container">
      <h2 className="sal-header">Financial Summary</h2>

      {/* Navigation Buttons */}
      <div className="sal-nav-buttons">
        <button onClick={() => setActiveSection('summary')}>Summary</button>
        <button onClick={() => setActiveSection('sales')}>Monthly Sales</button>
        <button onClick={() => setActiveSection('transactions')}>Transaction Details</button>
        <button onClick={() => setActiveSection('chart')}>Chart</button>
        <button onClick={() => setActiveSection('filters')}>Filters</button>
      </div>

      {/* Display Active Section */}
      {activeSection === 'summary' && summary && <SummaryCards summary={summary} />}
      {activeSection === 'sales' && filteredSales.length > 0 && <MonthlySalesTable filteredSales={filteredSales} />}
      {activeSection === 'transactions' && summary && <TransactionDetails summary={summary} />}
      {activeSection === 'chart' && chartData.labels.length > 0 && <FinancialChart chartData={chartData} />}
      {activeSection === 'filters' && <FilterControls filters={filters} setFilters={setFilters} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
    </div>
  );
};

export default FinancialSummary;

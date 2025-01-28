import axiosInstance from '../axiosInstance';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../styles/Users.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RegistrationGraphPage = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('months');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch registration data
  const fetchRegistrationGraph = async () => {
    try {
      const response = await axiosInstance.get('/users/registration-graph');
      setRegistrationData(response.data.graphData);
      console.log("Fetched data:", response.data.graphData); // Debugging line
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch registration graph data');
    }
  };

  // Filter data based on the selected time range
  const filterData = () => {
    const now = new Date();
    let filtered = [];
    let start = '';
    let end = '';

    if (timeRange === 'days') {
      start = new Date(now.setDate(now.getDate() - 7));
      end = new Date();
    } else if (timeRange === 'months') {
      start = new Date(now.setMonth(now.getMonth() - 1));
      end = new Date();
    } else if (timeRange === 'years') {
      start = new Date(now.setFullYear(now.getFullYear() - 1));
      end = new Date();
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      start = new Date(customStartDate);
      end = new Date(customEndDate);
    }

    filtered = registrationData.filter((item) => {
      const itemDate = new Date(item._id);
      return itemDate >= start && itemDate <= end;
    });

    setStartDate(start.toLocaleDateString());
    setEndDate(end.toLocaleDateString());
    setFilteredData(filtered);
    console.log("Filtered data:", filtered); // Debugging line
  };

  // Fetch data initially and when dependencies change
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      await fetchRegistrationGraph(); // Ensure data is fetched first
      filterData();                   // Filter data based on updated registrationData
    };
    fetchDataAndFilter();
  }, [timeRange, customStartDate, customEndDate]);

  const chartData = {
    labels: filteredData.map((item) => item._id || "N/A"),
    datasets: [
      {
        label: 'Registrations',
        data: filteredData.map((item) => item.count || 0),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="usal-dashboard">
      <h1 className="usal-dashboard-title">Registration Graph</h1>

      {error && <div className="usal-error-message">{error}</div>}

      <div className="usal-controls">
        <label htmlFor="time-range" className="usal-label">Select Time Range: </label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="usal-select"
        >
          <option value="days">Last 7 Days</option>
          <option value="months">Last Month</option>
          <option value="years">Last Year</option>
          <option value="custom">Custom Date Range</option>
        </select>
      </div>

      {timeRange === 'custom' && (
        <div className="usal-custom-range">
          <label htmlFor="start-date" className="usal-label">Start Date: </label>
          <input
            type="date"
            id="start-date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="usal-input"
          />
          <label htmlFor="end-date" className="usal-label">End Date: </label>
          <input
            type="date"
            id="end-date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="usal-input"
          />
        </div>
      )}

      <div className="usal-date-range">
        <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
      </div>

      <section className="usal-section">
        <div className="usal-chart">
          {filteredData.length > 0 ? (
            <Bar data={chartData} />
          ) : (
            <p>No data available to display.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegistrationGraphPage;

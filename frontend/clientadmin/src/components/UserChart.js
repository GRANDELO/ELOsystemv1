import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './styles/Users.css'; // Make sure to include necessary styles

const RegistrationGraphPage = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('months'); // Default time range is months
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch the graph data based on the selected time range
  const fetchRegistrationGraph = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/users/registration-graph');
      setRegistrationData(response.data.graphData);
      filterData(response.data.graphData); // Filter the data immediately after fetching
      setError(null);
    } catch (error) {
      setError('Failed to fetch registration graph data');
    }
  };

  // Function to filter data based on selected time range
  const filterData = (data) => {
    const now = new Date();
    let filtered = [];
    let startDate = '';
    let endDate = '';

    if (timeRange === 'days') {
      // Filter data for the past 7 days
      startDate = new Date();
      startDate.setDate(now.getDate() - 7); // 7 days ago
      endDate = now;
    } else if (timeRange === 'months') {
      // Filter data for the past month
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1); // 1 month ago
      endDate = now;
    } else if (timeRange === 'years') {
      // Filter data for the past year
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1); // 1 year ago
      endDate = now;
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      // Filter data for custom date range
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    }

    // Filter the data based on the calculated time range
    filtered = data.filter((item) => {
      const itemDate = new Date(item._id);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setStartDate(startDate.toLocaleDateString());
    setEndDate(endDate.toLocaleDateString());
    setFilteredData(filtered);
  };

  // Fetch the data when the component mounts or when timeRange changes
  useEffect(() => {
    fetchRegistrationGraph();
  }, [timeRange, customStartDate, customEndDate]);

  const chartData = {
    labels: filteredData.map((item) => item._id),
    datasets: [
      {
        label: 'Registrations',
        data: filteredData.map((item) => item.count),
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
          onChange={(e) => {
            setTimeRange(e.target.value);
            filterData(registrationData); // Re-filter data when time range changes
          }}
          className="usal-select"
        >
          <option value="days">Last 7 Days</option>
          <option value="months">Last Month</option>
          <option value="years">Last Year</option>
          <option value="custom">Custom Date Range</option>
        </select>
      </div>

      {/* Custom Date Range Selection */}
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

      {/* Display the start and end dates */}
      <div className="usal-date-range">
        <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
      </div>

      {/* Registration Graph */}
      <section className="usal-section">
        <div className="usal-chart">
          <Bar data={chartData} />
        </div>
      </section>
    </div>
  );
};

export default RegistrationGraphPage;

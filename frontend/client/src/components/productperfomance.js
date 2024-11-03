// src/components/BarChart.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getUsernameFromToken } from '../utils/auth';

const BarChart = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = getUsernameFromToken();

  useEffect(() => {
    const fetchProductPerformance = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/products/performance/${'kinyi'}`);
        setProductData(response.data);
      } catch (err) {
        setError('Failed to fetch product performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductPerformance();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the bar chart
  const labels = productData.map(product => product.name);
  const salesData = productData.map(product => product.dates.length); // Count of sales

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Sales',
        data: salesData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Product Sales Performance for {username}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

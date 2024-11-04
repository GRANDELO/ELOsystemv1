import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = 'kinyi';

  useEffect(() => {
    const fetchProductPerformance = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/performance/${username}`);
        setProductData(response.data);
      } catch (err) {
        setError('Failed to fetch product performance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductPerformance();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the bar chart
  const labels = productData.map(product => product.productName || "Unnamed Product");
  const salesData = productData.map(product => (product.saleDates ? product.saleDates.length : 0));

  // Configure data with gradient colors
  const backgroundColors = salesData.map(sales => 
    sales > 10 ? 'rgba(75, 192, 192, 0.7)' : 
    sales > 5 ? 'rgba(255, 159, 64, 0.7)' : 
                'rgba(255, 99, 132, 0.7)'
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Sales',
        data: salesData,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#666",
        },
        title: {
          display: true,
          text: "Sales Count",
          color: "#333",
          font: {
            size: 14,
          }
        }
      },
      x: {
        ticks: {
          color: "#666",
          font: {
            size: 12,
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false, // Hide legend as we only have one dataset
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} sales`
        }
      },
      title: {
        display: true,
        text: `Product Sales Performance for ${username}`,
        font: {
          size: 18,
        },
        color: "#333",
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce',
    },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

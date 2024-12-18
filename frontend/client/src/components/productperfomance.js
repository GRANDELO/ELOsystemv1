import axiosInstance from './axiosInstance';
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
import { getUsernameFromToken } from '../utils/auth';
import './styles/productpefomance.css'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const username = getUsernameFromToken();

  useEffect(() => {
    const fetchProductPerformance = async () => {
      try {
        const response = await axiosInstance.get(`/performance/${username}`);
        setProductData(response.data);
      } catch (err) {
        setError("No products sold for " + username);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductPerformance();
  }, [username]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // Prepare data for the main bar chart
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

  const handleChartClick = (event) => {
    const chartInstance = event.chart;
    const activePoints = chartInstance.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, false);
    if (activePoints.length > 0) {
      const chartIndex = activePoints[0].index;
      setSelectedProduct(productData[chartIndex]);
    }
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={{ ...options, onClick: handleChartClick }} />
      
      {selectedProduct && (
        <div className="selected-product">
          <h3 className="product-title">Monthly Sales for {selectedProduct.productName || "Unnamed Product"}</h3>
          <MonthlySalesChart saleDates={selectedProduct.saleDates} />
        </div>
      )}
    </div>
  );
};

// New component for the monthly sales chart
const MonthlySalesChart = ({ saleDates }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  // Get unique years from saleDates
  const getUniqueYears = (dates) => {
    const years = new Set();
    dates.forEach(date => {
      const year = new Date(date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort(); // Return sorted array
  };

  // Prepare years and months for selection
  const years = getUniqueYears(saleDates);
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Array [1, 2, ..., 12]

  // Function to filter sales data by selected month and year
  const getMonthlySalesData = (salesDates) => {
    const salesCountByMonth = {};
    
    salesDates.forEach(date => {
      const saleDate = new Date(date);
      if (saleDate.getMonth() + 1 === selectedMonth && saleDate.getFullYear() === selectedYear) {
        const yearMonth = `${saleDate.getFullYear()}-${saleDate.getMonth() + 1}`; // YYYY-MM format
        salesCountByMonth[yearMonth] = (salesCountByMonth[yearMonth] || 0) + 1;
      }
    });

    // Prepare labels and data for the monthly chart
    const labels = Object.keys(salesCountByMonth);
    const salesData = Object.values(salesCountByMonth);
    return { labels, salesData };
  };

  const { labels, salesData } = getMonthlySalesData(saleDates);

  const data = {
    labels: labels.length > 0 ? labels : ["No data"],
    datasets: [
      {
        label: 'Sales Per Month',
        data: salesData.length > 0 ? salesData : [0],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
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
        title: {
          display: true,
          text: "Month-Year",
          color: "#333",
          font: {
            size: 14,
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Sales Data Per Month",
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
    <div className="monthly-sales-container">
      <div className="month-year-selector">
        <label htmlFor="year">Select Year:</label>
        <select 
          id="year" 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="month" style={{ marginLeft: "10px" }}>Select Month:</label>
        <select 
          id="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

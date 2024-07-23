import axios from 'axios';
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import './styles/UserChart.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'No Data',
            data: [],
            fill: false,
            backgroundColor: '#009879',
            borderColor: '#009879',
        }]
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const fetchYears = async () => {
            const currentYear = new Date().getFullYear();
            const yearsArray = Array.from({ length: 5 }, (_, i) => currentYear - i);
            setYears(yearsArray.map(year => ({ value: year, label: year })));
        };

        fetchYears();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`https://elosystemv1.onrender.com/api/users/users-per-month?year=${selectedYear}`);
                const data = res.data;

                const months = Array.from({ length: 12 }, (_, i) => i + 1);
                const counts = months.map(month => {
                    const monthData = (data || []).find(d => d._id === month);
                    return monthData ? monthData.count : 0;
                });

                setChartData({
                    labels: months.map(month => new Date(0, month - 1).toLocaleString('en', { month: 'short' })),
                    datasets: [
                        {
                            label: `New Users per Month (${selectedYear})`,
                            data: counts,
                            fill: false,
                            backgroundColor: '#009879',
                            borderColor: '#009879',
                        },
                    ],
                });
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, [selectedYear]);

    return (
        <div className="chart-container">
            <h1>New Users per Month</h1>
            <div className="filters">
                <Select
                    options={years}
                    value={years.find(year => year.value === selectedYear)}
                    onChange={option => setSelectedYear(option.value)}
                    placeholder="Select Year"
                />
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="End Date"
                />
            </div>
            <div className="chart-wrapper">
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default UserChart;

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Select from 'react-select';
import axios from 'axios';

const UserChart = () => {
    const [chartData, setChartData] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchYears = async () => {
            // Fetch distinct years or generate them based on the current year
            const currentYear = new Date().getFullYear();
            const yearsArray = Array.from({ length: 5 }, (_, i) => currentYear - i);
            setYears(yearsArray.map(year => ({ value: year, label: year })));
        };

        fetchYears();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`/api/users/users-per-month?year=${selectedYear}`);
                const data = res.data;
                const months = Array.from({ length: 12 }, (_, i) => i + 1);
                const counts = months.map(month => {
                    const monthData = data.find(d => d._id === month);
                    return monthData ? monthData.count : 0;
                });

                setChartData({
                    labels: months.map(month => new Date(0, month - 1).toLocaleString('en', { month: 'short' })),
                    datasets: [
                        {
                            label: `Users per Month (${selectedYear})`,
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
        <div>
            <h1>Users per Month</h1>
            <Select
                options={years}
                value={years.find(year => year.value === selectedYear)}
                onChange={option => setSelectedYear(option.value)}
                placeholder="Select Year"
            />
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default UserChart;

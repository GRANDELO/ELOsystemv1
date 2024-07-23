import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './styles/Sales.css';

const Sales = () => {
    const [salesData, setSalesData] = useState({
        labels: [],
        datasets: [{
            label: 'Sales',
            data: [],
            fill: false,
            backgroundColor: '#42A5F5',
            borderColor: '#42A5F5',
        }]
    });
    const [recentSales, setRecentSales] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const res = await axios.get('https://elosystemv1.onrender.com/api/dash/sales/monthly');
                const data = res.data;

                setSalesData({
                    labels: data.map(sale => sale.month),
                    datasets: [{
                        label: 'Sales',
                        data: data.map(sale => sale.total),
                        fill: false,
                        backgroundColor: '#42A5F5',
                        borderColor: '#42A5F5',
                    }]
                });
            } catch (err) {
                console.error('Error fetching sales data:', err);
            }
        };

        const fetchRecentSales = async () => {
            try {
                const res = await axios.get('https://elosystemv1.onrender.com/api/dash/sales/recent');
                setRecentSales(res.data);
            } catch (err) {
                console.error('Error fetching recent sales:', err);
            }
        };

        fetchSalesData();
        fetchRecentSales();
    }, []);

    return (
        <div className="sales-container">
            <h1>Sales Overview</h1>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Line data={salesData} />
            </div>
            <div className="recent-sales">
                <h2>Recent Sales</h2>
                <ul>
                    {recentSales.map(sale => (
                        <li key={sale.id}>{sale.description} - ${sale.amount}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sales;

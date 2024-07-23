// src/components/Reports.js
import axios from 'axios';
import React, { useState } from 'react';
import './styles/Reports.css';

const Reports = () => {
    const [reportType, setReportType] = useState('summary');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://elosystemv1.onrender.com/api/dash/reports?reportType=${reportType}`);
            setReportData(res.data);
        } catch (err) {
            console.error('Error generating report:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <div className="report-options">
                <label htmlFor="reportType">Select Report Type:</label>
                <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <option value="summary">Summary</option>
                    <option value="detailed">Detailed</option>
                    <option value="sales">Sales</option>
                    <option value="user">User</option>
                </select>
                <button onClick={generateReport}>Generate Report</button>
            </div>
            {loading && <p>Loading...</p>}
            {reportData && (
                <div className="report-data">
                    <h2>Report Data</h2>
                    <pre>{JSON.stringify(reportData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Reports;

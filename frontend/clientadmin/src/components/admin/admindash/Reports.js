// src/components/Reports.js
import React from 'react';

function Reports() {
    const reports = ['User Growth', 'Revenue', 'System Usage'];

    return (
        <div className="reports">
            <h2>Reports</h2>
            <ul>
                {reports.map((report, index) => (
                    <li key={index}><a href={`/reports/${report.toLowerCase().replace(' ', '-')}`}>{report}</a></li>
                ))}
            </ul>
        </div>
    );
}

export default Reports;

// MonthlySalesTable.js
import React from 'react';

const MonthlySalesTable = ({ filteredSales }) => (
  <div>
    <h3 className="sal-subheader">Monthly Sales</h3>
    <table className="sal-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Income</th>
          <th>Expenses</th>
        </tr>
      </thead>
      <tbody>
        {filteredSales.map(([month, data]) => (
          <tr key={month}>
            <td>{month}</td>
            <td>{data.income.toLocaleString()}</td>
            <td>{data.expenses.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MonthlySalesTable;

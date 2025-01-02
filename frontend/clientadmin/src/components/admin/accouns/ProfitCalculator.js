import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfitCalculator = () => {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profit, setProfit] = useState(0);

  const fetchProfit = async () => {
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/profit');
      setRevenue(response.data.revenue);
      setExpenses(response.data.expenses);
      setProfit(response.data.profit);
    } catch (err) {
      console.error('Error fetching profit:', err);
    }
  };

  useEffect(() => {
    fetchProfit();
  }, []);

  return (
    <div>
      <h3>Profit Calculation</h3>
      <p>Revenue: {revenue}</p>
      <p>Expenses: {expenses}</p>
      <p>Profit: {profit}</p>
    </div>
  );
};

export default ProfitCalculator;

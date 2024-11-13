const CompanyFinancials = require('../models/CompanyFinancials');
const mongoose = require('mongoose');

// Helper functions
const calculateTotal = (transactions, type) => {
  return transactions
    .filter(transaction => transaction.transactionType === type)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

const groupByMonth = (transactions) => {
  return transactions.reduce((months, transaction) => {
    const month = transaction.createdAt.getMonth();
    const year = transaction.createdAt.getFullYear();
    const key = `${year}-${month + 1}`;
    if (!months[key]) months[key] = { income: 0, expenses: 0 };
    months[key][transaction.transactionType === 'income' ? 'income' : 'expenses'] += transaction.amount;
    return months;
  }, {});
};

// Controller for financial summary
const financialsController = {
  async getFinancialSummary(req, res) {
    const { month, year } = req.query; // Fetch filters from query params

    try {
      const financials = await CompanyFinancials.findOne();
      if (!financials) return res.status(404).json({ message: 'No financial data found' });

      const filteredTransactions = financials.transactions.filter(transaction => {
        const transactionYear = transaction.createdAt.getFullYear();
        const transactionMonth = transaction.createdAt.getMonth() + 1; // JS months are 0-based
        return (!year || transactionYear === parseInt(year)) && (!month || transactionMonth === parseInt(month));
      });

      const totalIncome = calculateTotal(filteredTransactions, 'income');
      const totalExpenses = calculateTotal(filteredTransactions, 'expense');
      const netBalance = totalIncome - totalExpenses;
      const monthlySales = groupByMonth(filteredTransactions);

      const totalTransactions = filteredTransactions.length;
      const avgIncome = totalIncome / (totalTransactions || 1);
      const avgExpenses = totalExpenses / (totalTransactions || 1);

      res.json({
        totalIncome,
        totalExpenses,
        netBalance,
        monthlySales,
        totalTransactions,
        avgIncome,
        avgExpenses,
        lastUpdated: financials.updatedAt,
      });
      
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      res.status(500).json({ message: 'Error fetching financial summary' });
    }
  }
};

module.exports = financialsController;

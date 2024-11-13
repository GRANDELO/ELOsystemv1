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
    const { year, month } = req.query;
    try {
      // Query financials data with optional date filters
      const query = {};
      if (year) query['createdAt'] = { $gte: new Date(`${year}-01-01`), $lt: new Date(`${parseInt(year) + 1}-01-01`) };
      if (month) query['createdAt'] = { $gte: new Date(`${year}-${month}-01`), $lt: new Date(`${year}-${parseInt(month) + 1}-01`) };
      
      const financials = await CompanyFinancials.findOne(query);
      if (!financials) return res.status(404).json({ message: 'No financial data found' });

      const totalIncome = financials.transactions
        .filter(transaction => transaction.transactionType === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      const totalExpenses = financials.transactions
        .filter(transaction => transaction.transactionType === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      const netBalance = totalIncome - totalExpenses;

      // Monthly Sales Breakdown
      const monthlySales = financials.transactions.reduce((months, transaction) => {
        const monthKey = `${transaction.createdAt.getFullYear()}-${transaction.createdAt.getMonth() + 1}`;
        if (!months[monthKey]) months[monthKey] = { income: 0, expenses: 0 };
        
        if (transaction.transactionType === 'income') months[monthKey].income += transaction.amount;
        else if (transaction.transactionType === 'expense') months[monthKey].expenses += transaction.amount;
        
        return months;
      }, {});

      res.json({
        totalIncome,
        totalExpenses,
        netBalance,
        monthlySales,
        totalTransactions: financials.transactions.length,
        avgIncome: totalIncome / (financials.transactions.length || 1),
        avgExpenses: totalExpenses / (financials.transactions.length || 1),
        lastUpdated: financials.updatedAt
      });
      
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      res.status(500).json({ message: 'Error fetching financial summary' });
    }
  }
};

module.exports = financialsController;

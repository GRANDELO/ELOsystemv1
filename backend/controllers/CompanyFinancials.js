const CompanyFinancials = require('../models/CompanyFinancials'); // Update path as needed
const mongoose = require('mongoose');

// Controller for financial monitoring
const financialsController = {

  // Get total sales, monthly sales, incomes, and expenses
  async getFinancialSummary(req, res) {
    try {
      // Retrieve financial data
      const financials = await CompanyFinancials.findOne();

      if (!financials) {
        return res.status(404).json({ message: 'No financial data found' });
      }

      // Calculate total income and total expenses from transactions
      const totalIncome = financials.transactions
        .filter(transaction => transaction.transactionType === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      const totalExpenses = financials.transactions
        .filter(transaction => transaction.transactionType === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      // Calculate net balance
      const netBalance = totalIncome - totalExpenses;

      // Group transactions by month for monthly sales report
      const monthlySales = financials.transactions.reduce((months, transaction) => {
        const month = transaction.createdAt.getMonth();
        const year = transaction.createdAt.getFullYear();
        const key = `${year}-${month + 1}`;

        if (!months[key]) {
          months[key] = { income: 0, expenses: 0 };
        }
        
        if (transaction.transactionType === 'income') {
          months[key].income += transaction.amount;
        } else if (transaction.transactionType === 'expense') {
          months[key].expenses += transaction.amount;
        }

        return months;
      }, {});

      // Additional financial data could include transaction counts or average income/expense
      const totalTransactions = financials.transactions.length;
      const avgIncome = totalIncome / (totalTransactions || 1);
      const avgExpenses = totalExpenses / (totalTransactions || 1);

      // Send summary response
      res.json({
        totalIncome,
        totalExpenses,
        netBalance,
        monthlySales,
        totalTransactions,
        avgIncome,
        avgExpenses,
        lastUpdated: financials.updatedAt
      });
      
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      res.status(500).json({ message: 'Error fetching financial summary' });
    }
  }
};

module.exports = financialsController;

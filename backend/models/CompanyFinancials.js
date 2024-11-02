const mongoose = require('mongoose');

const FinancialTransactionSchema = new mongoose.Schema({
  transactionType: { // 'income' or 'expense'
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CompanyFinancialsSchema = new mongoose.Schema({
  transactions: [FinancialTransactionSchema],
  totalIncome: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  },
  netBalance: {
    type: Number,
    default: 0 // Total income - Total expenses
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const CompanyFinancials = mongoose.model('CompanyFinancials', CompanyFinancialsSchema);

module.exports = CompanyFinancials;

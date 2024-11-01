// models/TransactionLedger.js
const mongoose = require('mongoose');

const transactionLedgerSchema = new mongoose.Schema({
  orderId: String,
  seller: String,
  sellerEarnings: Number,
  companyEarnings: Number,
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransactionLedger', transactionLedgerSchema);

// models/TransactionLedger.js
const mongoose = require('mongoose');

const transactionLedgerSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  seller: String,
  sellerEarnings: Number,
  companyEarnings: Number,
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransactionLedger', transactionLedgerSchema);

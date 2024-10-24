// models/mpesaModel.js
const mongoose = require('mongoose');

const mpesaTransactionSchema = new mongoose.Schema({
  TransactionType: String,
  TransID: String,
  TransTime: String,
  TransAmount: Number,
  BusinessShortCode: String,
  BillRefNumber: String,
  InvoiceNumber: String,
  OrgAccountBalance: String,
  ThirdPartyTransID: String,
  MSISDN: String,
  FirstName: String,
  MiddleName: String,
  LastName: String
});

module.exports = mongoose.model('MpesaTransaction', mpesaTransactionSchema);

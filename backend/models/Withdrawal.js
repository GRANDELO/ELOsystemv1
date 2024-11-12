// models/Withdrawal.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phonenumber: { type: String, required: true },
  time: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true } // Remaining balance after withdrawal
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);

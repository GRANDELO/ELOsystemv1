const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },  // Date of the transaction
  description: { type: String, required: true },  // Short description of the transaction
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },  // Reference to the account
  debit: { type: Number, default: 0 },  // Debit amount
  credit: { type: Number, default: 0 },  // Credit amount
});

module.exports = mongoose.model("Transaction", transactionSchema);

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the account, e.g., "Cash", "Sales"
  type: { 
    type: String, 
    enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"], 
    required: true 
  },
});

module.exports = mongoose.model("Account", accountSchema);

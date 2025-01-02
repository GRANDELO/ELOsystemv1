const Transaction = require("../models/Transaction");
const mongoose = require('mongoose');
const Account = require('../models/Account');

exports.createTransaction = async (req, res) => {
  const { description, accountId, debit, credit } = req.body;

  try {
    const newTransaction = new Transaction({ 
      description, 
      account: accountId, 
      debit, 
      credit 
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: "Error creating transaction" });
  }
};

exports.getAllTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
  };

exports.getTransactionsByAccount = async (req, res) => {
  const { accountId } = req.params;

  try {
    const transactions = await Transaction.find({ account: accountId });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};



async function calculateTrialBalance() {
  try {
    const trialBalance = await Transaction.aggregate([
      {
        $group: {
          _id: "$account",  // Group by account
          totalDebit: { $sum: "$debit" },  // Sum of debits
          totalCredit: { $sum: "$credit" },  // Sum of credits
        },
      },
      {
        $lookup: {
          from: "accounts",  // Assuming you have an Account model
          localField: "_id",  // Match the account id
          foreignField: "_id",  // From the Account collection
          as: "accountDetails",
        },
      },
      {
        $unwind: "$accountDetails",  // Unwind the account details to get the account info
      },
      {
        $project: {
          account: "$accountDetails.name",  // Assuming Account has a 'name' field
          totalDebit: 1,
          totalCredit: 1,
          balance: { $subtract: ["$totalDebit", "$totalCredit"] },  // Calculate balance (debit - credit)
        },
      },
    ]);

    return trialBalance;
  } catch (error) {
    console.error("Error calculating trial balance:", error);
    throw error;
  }
}

module.exports = { calculateTrialBalance };






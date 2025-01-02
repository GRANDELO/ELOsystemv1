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





exports.getTrialBalance = async (req, res) => {
  try {

    res.set('Cache-Control', 'no-store');

    const trialBalance = await Transaction.aggregate([
      {
        $group: {
          _id: '$account',
          totalDebit: { $sum: '$debit' },
          totalCredit: { $sum: '$credit' },
        },
      },
      {
        $lookup: {
          from: 'accounts', // Ensure 'accounts' matches your collection name
          localField: '_id',
          foreignField: '_id',
          as: 'accountDetails',
        },
      },
      { $unwind: { path: '$accountDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          accountName: { $ifNull: ['$accountDetails.name', 'Unknown'] },
          accountType: { $ifNull: ['$accountDetails.type', 'Unknown'] },
          totalDebit: 1,
          totalCredit: 1,
        },
      },
    ]);

    if (trialBalance.length === 0) {
      return res.status(200).json({
        message: 'No transactions found. Trial balance is empty.',
        trialBalance: [],
        totalDebits: 0,
        totalCredits: 0,
        isBalanced: true,
      });
    }

    const totalDebits = trialBalance.reduce(
      (sum, entry) => sum + entry.totalDebit,
      0
    );
    const totalCredits = trialBalance.reduce(
      (sum, entry) => sum + entry.totalCredit,
      0
    );

    const isBalanced = totalDebits === totalCredits;

    res.status(200).json({
      message: isBalanced ? 'Trial balance is balanced.' : 'Trial balance is not balanced.',
      trialBalance,
      totalDebits,
      totalCredits,
      isBalanced,
    });
  } catch (error) {
    console.error('Error generating trial balance:', error);
    res.status(500).json({
      message: 'Error generating trial balance. Please try again later.',
    });
  }
};







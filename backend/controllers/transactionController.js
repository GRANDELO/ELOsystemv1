const Transaction = require("../models/Transaction");
const mongoose = require('mongoose');

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



/**
 * Get Trial Balance
 */


exports.getTrialBalance = async (req, res) => {
  try {
    // Check if there are transactions in the database
    const transactionCount = await Transaction.countDocuments();
    if (transactionCount === 0) {
      return res.status(404).json({
        message: 'No transactions found. Unable to generate trial balance.',
      });
    }

    // Aggregate the transactions
    const trialBalance = await Transaction.aggregate([
      {
        $group: {
          _id: '$accountId', // Group by accountId
          totalDebit: { $sum: '$debit' }, // Sum all debits
          totalCredit: { $sum: '$credit' }, // Sum all credits
        },
      },
      {
        $lookup: {
          from: 'accounts', // Correct collection name
          localField: '_id',
          foreignField: '_id',
          as: 'accountDetails',
        },
      },
      {
        $unwind: {
          path: '$accountDetails',
          preserveNullAndEmptyArrays: true, // Ensure accounts without details are included
        },
      },
      {
        $project: {
          accountName: { $ifNull: ['$accountDetails.name', 'Unknown'] },
          accountType: { $ifNull: ['$accountDetails.type', 'Unknown'] },
          totalDebit: 1,
          totalCredit: 1,
        },
      },
    ]);

    // Validate the trial balance results
    if (!trialBalance || trialBalance.length === 0) {
      return res.status(404).json({
        message: 'No transactions found to generate the trial balance.',
      });
    }

    // Calculate total debits and credits
    const totalDebits = trialBalance.reduce((sum, acc) => sum + acc.totalDebit, 0);
    const totalCredits = trialBalance.reduce((sum, acc) => sum + acc.totalCredit, 0);

    // Check if trial balance is balanced
    const isBalanced = totalDebits.toFixed(2) === totalCredits.toFixed(2);

    // Return the trial balance results
    res.status(200).json({
      trialBalance,
      totalDebits: totalDebits.toFixed(2),
      totalCredits: totalCredits.toFixed(2),
      isBalanced,
      message: isBalanced
        ? 'The trial balance is balanced.'
        : 'The trial balance is not balanced. Please check the transactions.',
    });
  } catch (error) {
    console.error('Error calculating trial balance:', error);
    res.status(500).json({
      message: 'Error calculating trial balance',
      error: error.message,
    });
  }
};




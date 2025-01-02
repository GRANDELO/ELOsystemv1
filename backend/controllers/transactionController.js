const Transaction = require("../models/Transaction");

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
    // Aggregate the transactions to calculate total debits and credits for each account
    const trialBalance = await Transaction.aggregate([
      {
        $group: {
          _id: '$accountId', // Group by accountId
          totalDebit: { $sum: '$debit' }, // Sum of all debits for the account
          totalCredit: { $sum: '$credit' }, // Sum of all credits for the account
        },
      },
      {
        $lookup: {
          from: 'accounts', // Collection name for accounts
          localField: '_id',
          foreignField: '_id',
          as: 'accountDetails',
        },
      },
      {
        $unwind: '$accountDetails', // Unwind the account details array
      },
      {
        $project: {
          accountName: '$accountDetails.name', // Include the account name
          accountType: '$accountDetails.type', // Include the account type
          totalDebit: 1,
          totalCredit: 1,
        },
      },
    ]);

    // Add a validation step for trial balance equality
    const totalDebits = trialBalance.reduce((sum, acc) => sum + acc.totalDebit, 0);
    const totalCredits = trialBalance.reduce((sum, acc) => sum + acc.totalCredit, 0);

    const isBalanced = totalDebits === totalCredits;

    // Respond with trial balance details
    res.status(200).json({
      trialBalance,
      totalDebits,
      totalCredits,
      isBalanced,
      message: isBalanced
        ? 'The trial balance is balanced.'
        : 'The trial balance is not balanced. Please check the transactions.',
    });
  } catch (error) {
    console.error('Error calculating trial balance:', error);
    res.status(500).json({ message: 'Error calculating trial balance', error });
  }
};



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
      const transactions = await Transaction.find().populate('accountId', 'name type');
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

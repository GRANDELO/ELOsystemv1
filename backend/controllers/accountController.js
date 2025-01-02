const Account = require("../models/Account");

exports.createAccount = async (req, res) => {
  const { name, type } = req.body;

  try {
    const newAccount = new Account({ name, type });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: "Error creating account" });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching accounts" });
  }
};

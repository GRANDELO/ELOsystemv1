// controllers/withdrawalController.js
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const {b2cRequestHandler} = require("./mpesaController");

// Handle withdrawal logic
exports.withdraw = async (req, res) => {
  const { username, amount, Phonenumber } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has enough balance
    if (user.amount < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct the withdrawal amount from the user's balance
    const resp = await b2cRequestHandler(amount, Phonenumber);
    console.log(resp);
    
    user.amount -= amount;
    await user.save();

    // Record the withdrawal
    const withdrawal = new Withdrawal({
      username: user.username,
      phonenumber: Phonenumber,
      amount: amount,
      balance: user.amount,
    });
    await withdrawal.save();

    // Send success response
    res.status(200).json({ message: 'Withdrawal successful', balance: user.amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all withdrawals for a specific user
exports.getWithdrawalsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const withdrawals = await Withdrawal.find({ username });
    if (!withdrawals.length) {
      return res.status(404).json({ message: 'No withdrawals found for this user' });
    }
    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

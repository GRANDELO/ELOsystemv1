const User = require('../models/DeliveryPersonnel');
const mongoose = require('mongoose');

// Show all users
exports.getAllUsers = async (req, res) => {
  try {
    
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Disable a user
exports.disableUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, { isDisabled: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User disabled successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling user', error });
  }
};

// Undo disable a user
exports.undoDisableUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, { isDisabled: false }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User reactivated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error reactivating user', error });
  }
};

// Show a graph of registration dates
exports.getRegistrationDatesGraph = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ graphData: users });
  } catch (error) {
    res.status(500).json({ message: 'Error generating registration graph', error });
  }
};

// Show active users
exports.getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find({ active: true });
    res.status(200).json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active users', error });
  }
};

// Show disabled users
exports.getDisabledUsers = async (req, res) => {
  try {
    const disabledUsers = await User.find({ isDisabled: true });
    res.status(200).json(disabledUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disabled users', error });
  }
};

// Show unverified users
exports.getUnverifiedUsers = async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ isVerified: false });
    res.status(200).json(unverifiedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unverified users', error });
  }
};

exports.updatePaymentPrice = async (req, res) => {
  try {
    // Extract data from request body
    const { deliveryPersonId, paymentPrice } = req.body;

    // Manual validation
    if (!deliveryPersonId) {
      console.log('Missing deliveryPersonId');
      return res.status(400).json({ msg: 'Delivery person ID is required' });
    }

    if (paymentPrice === undefined || isNaN(paymentPrice) || paymentPrice < 0) {
      console.log(`Invalid payment price: ${paymentPrice}`);
      return res.status(400).json({ msg: 'Invalid payment price. It must be a positive number.' });
    }

    console.log(`Fetching delivery person with ID: ${deliveryPersonId}`);

    // Find the delivery person
    const deliveryPerson = await User.findById(deliveryPersonId);

    if (!deliveryPerson) {
      console.log(`Delivery person not found with ID: ${deliveryPersonId}`);
      return res.status(404).json({ msg: 'Delivery person not found' });
    }

    // Update payment price
    console.log(`Updating payment price for delivery person: ${deliveryPersonId}`);
    deliveryPerson.amounttobepaid = paymentPrice;

    // Save updated data
    await deliveryPerson.save();
    console.log('Payment price updated successfully:', deliveryPerson);

    res.json({ msg: 'Payment price updated successfully', deliveryPerson });
  } catch (err) {
    console.error('Error updating payment price:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
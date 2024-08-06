// In routes/orders.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/logistics', async (req, res) => {
  try {
    const orders = await Order.find().populate('deliveryPerson');
    res.status(200).json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;

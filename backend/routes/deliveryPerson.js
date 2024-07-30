const express = require('express');
const DeliveryPerson = require('../models/DeliveryPerson');
const router = express.Router();

router.post('/add', async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const deliveryPerson = new DeliveryPerson({ name, email, phoneNumber });
    await deliveryPerson.save();
    res.status(201).json({ message: 'Delivery person added successfully', deliveryPerson });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add delivery person', error: err.message });
  }
});

module.exports = router;

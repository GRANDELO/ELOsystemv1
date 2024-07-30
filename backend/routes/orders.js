const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');

router.post('/', async (req, res) => {
  const { items, totalPrice, paymentMethod, destination, orderDate, username } = req.body;

  try {
    if (!items || !totalPrice || !paymentMethod || !destination || !orderDate || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find an available delivery person
    const deliveryPerson = await DeliveryPerson.findOne({ status: 'available' }).sort({ createdAt: 1 });

    // Create a new order
    const order = new Order({
      items,
      totalPrice,
      paymentMethod,
      destination,
      orderDate,
      username,
      deliveryPerson: deliveryPerson ? deliveryPerson._id : null,
      isDeliveryInProcess: false,
      isDelivered: false
    });

    await order.save();

    // Update delivery person's status if assigned
    if (deliveryPerson) {
      deliveryPerson.status = 'assigned';
      await deliveryPerson.save();
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
});

module.exports = router;

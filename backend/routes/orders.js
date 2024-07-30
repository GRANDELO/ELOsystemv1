const express = require('express');
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, destination, orderDate, username } = req.body;

    if (!items || !totalPrice || !paymentMethod || !destination || !orderDate || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Optionally, assign a delivery person (for simplicity, assigning a random one)
    const deliveryPersons = await DeliveryPerson.find();
    const deliveryPerson = deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)];

    // Create a new order
    const newOrder = new Order({
      items,
      totalPrice,
      paymentMethod,
      destination,
      orderDate,
      deliveryPerson: deliveryPerson ? deliveryPerson._id : null, // Assign delivery person
      username, // Store the username of the person placing the order
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Failed to place order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', async (req, res) => {
  try {
    const { isDeliveryInProcess, isDelivered } = req.body;
    
    const updateFields = {};
    if (isDeliveryInProcess !== undefined) updateFields.isDeliveryInProcess = isDeliveryInProcess;
    if (isDelivered !== undefined) updateFields.isDelivered = isDelivered;

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Failed to update order:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

module.exports = router;

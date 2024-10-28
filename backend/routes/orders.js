const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/', orderController.createOrder);
router.put('/assign', orderController.assignOrder); // Route to assign order
router.get('/', orderController.getOrders); // Route to fetch all orders

// You can add more routes here if needed.

module.exports = router;

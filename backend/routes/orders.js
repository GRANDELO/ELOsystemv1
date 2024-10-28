const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/', orderController.createOrder);
router.get('/:eid', ordersController.getOrder);

// You can add more routes here if needed.

module.exports = router;

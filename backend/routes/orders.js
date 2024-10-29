const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/', orderController.createOrder);
router.get('/:eid', orderController.getOrder);
router.get('/my/:username', orderController.getMyOrder);
router.patch('/:orderId/status', orderController.updateOrderStatus);
// You can add more routes here if needed.

module.exports = router;

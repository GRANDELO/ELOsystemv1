const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/', orderController.createOrder);
router.get('/:eid', orderController.getOrder);
router.patch('/:orderId/status', orderController.updateOrderStatus);
router.get('/unpacked-products', orderController.getUnpackedOrderProducts);
router.patch('/orders/:orderId/packed', orderController.markOrderAsPacked); 
// You can add more routes here if needed.

module.exports = router;

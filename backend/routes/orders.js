const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/', orderController.createOrder);
router.get('/:eid', orderController.getOrder);
router.get('/unpackedproducts', orderController.getUnpackedOrderProducts);
router.patch('/:orderId/status', orderController.updateOrderStatus);
router.patch('/:orderId/packed', orderController.markOrderAsPacked); 
// You can add more routes here if needed.

module.exports = router;

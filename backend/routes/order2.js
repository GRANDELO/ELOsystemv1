const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.get('/unpacked', orderController.getUnpackedOrderProducts);
router.patch('/:orderId/packed', orderController.markOrderAsPacked); 
router.post('/:orderId/deliverypatcher', orderController.deliverypatcher);

// You can add more routes here if needed.

module.exports = router;

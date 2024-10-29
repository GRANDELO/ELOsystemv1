const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for Orders
router.post('/mpesaidadder', orderController.mpesaidadder);
router.get('/unpacked', orderController.getUnpackedOrderProducts);
router.patch('/:orderId/packed', orderController.markOrderAsPacked); 
router.patch('/:orderId/deliverypatcher', orderController.deliverypatcher);

// You can add more routes here if needed.

module.exports = router;

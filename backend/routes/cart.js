const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/',cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/remove',  cartController.removeFromCart);
router.post('/clear',  cartController.clearCart);

module.exports = router;

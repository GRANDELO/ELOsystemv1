const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');

router.post('/cart', getCart);
router.post('/cart/add', addToCart);
router.post('/cart/remove', removeFromCart);
router.post('/cart/clear', clearCart);

module.exports = router;

// routes.js or app.js
const express = require('express');
const { postProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/products', postProduct);

module.exports = router;

// routes.js or app.js
const express = require('express');
const { getProduct, getProducts, postProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/products', postProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);

module.exports = router;

// routes.js or app.js
const express = require('express');
const { getProduct, getProducts, postProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/products', postProduct);
router.get('/products', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.get('/files/:filename', getImage);

module.exports = router;

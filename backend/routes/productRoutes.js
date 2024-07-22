// src/routes/productRoutes.js
const express = require('express');
const { getProduct, getProducts, postProduct, updateProduct, deleteProduct, getImage } = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/products', authenticateToken, postProduct);
router.get('/products', authenticateToken, getProducts);
router.get('/products/:id', authenticateToken, getProduct);
router.put('/products/:id', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);
router.get('/files/:filename', authenticateToken, getImage);

module.exports = router;

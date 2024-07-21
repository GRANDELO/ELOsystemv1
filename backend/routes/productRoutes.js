const express = require('express');
const { getProduct, getProducts, postProduct, updateProduct, deleteProduct, getImage } = require('../controllers/productController');
const router = express.Router();

router.post('/products', postProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct); // Add this route for deleting a product
router.get('/files/:filename', getImage);

module.exports = router;

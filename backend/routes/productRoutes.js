const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Correct middleware path
const productController = require('../controllers/productController');

// Define routes with proper handlers
router.post('/products', upload.single('image'), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/images/:filename', productController.getImage);

module.exports = router;

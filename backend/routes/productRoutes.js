const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Make sure this path is correct
const productController = require('../controllers/productController'); // Make sure this path is correct

// Define routes with proper handlers
router.post('/products', upload.single('image'), productController.createProduct);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/images/:filename', productController.getImage);

module.exports = router;

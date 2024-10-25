const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.post('/products', upload.single('image'), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/images/:filename', productController.getImage);
router.get('/products/:id', productController.getNewProductById);
module.exports = router;

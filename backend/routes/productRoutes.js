const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.get('/performance/:username', productController.getProductPerformanceByUsername);
router.post('/products', upload.array('images', 6), productController.createProduct);

// Route to handle uploading of logo and background images
router.post('/updateshoplogoUrl', upload.single('logo'), upload.array('background'), productController.updateshoplogoUrl);


router.get('/products', productController.getAllProducts);
router.get('/images/:filename', productController.getImage);
router.get('/products/:id', productController.getNewProductById);
router.patch('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

module.exports = router;

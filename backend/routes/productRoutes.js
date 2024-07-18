const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createProduct, getAllProducts } = require('../controllers/productController');

router.post('/products', upload.single('image'), createProduct);
router.get('/products', getAllProducts);

module.exports = router;

const express = require('express');
const upload = require('../services/multerConfig'); // Import the multer configuration
const { getProduct, getProducts, postProduct, updateProduct, deleteProduct, getImage } = require('../controllers/productController');
const router = express.Router();

router.post('/products', upload.single('image'), postProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/files/:filename', getImage);

module.exports = router;

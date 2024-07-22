const express = require('express');
const router = express.Router();
const {
  postProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Define routes
router.post('/products', postProduct);
router.get('/products/:id', getProduct);
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;

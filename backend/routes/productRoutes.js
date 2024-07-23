const express = require('express');
const router = express.Router();
const { addProduct, getProduct, updateProduct, deleteProduct, upload } = require('../controllers/productController');
const { protect } = require('../middleware/upload');

router.route('/')
  .post(protect, upload.single('image'), addProduct);
router.route('/:id')
  .get(protect, getProduct)
  .put(protect, upload.single('image'), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;

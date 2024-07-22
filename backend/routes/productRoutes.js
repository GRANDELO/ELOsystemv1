const express = require('express');
const {
  getProduct,
  getProducts,
  postProduct,
  updateProduct,
  deleteProduct,
  getImage,
} = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/products', (req, res, next) => {
  req.upload.single('image')(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });
    next();
  });
}, postProduct);

router.get('/products', getProducts);
router.get('/products/:id', getProduct);

router.put('/products/:id', (req, res, next) => {
  req.upload.single('image')(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });
    next();
  });
}, updateProduct);

router.delete('/products/:id', deleteProduct);
router.get('/files/:filename', getImage);

module.exports = router;

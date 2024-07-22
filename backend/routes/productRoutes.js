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
const upload = require('../middleware/upload');
const router = express.Router();

const handleUpload = (req, res, next) => {
  req.upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }
    next();
  });
};

router.post('/products', handleUpload, postProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', handleUpload, updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/files/:filename', getImage);

module.exports = router;

const express = require('express');
const router = express.Router();
const newproductController = require('../controllers/newproductController');

router.post('/newproducts', newproductController.createNewProduct);
router.get('/newproducts', newproductController.getNewProducts);
router.get('/newproducts/:id', newproductController.getNewProductById);
router.put('/newproducts/:id', newproductController.updateNewProduct);
router.delete('/newproducts/:id', newproductController.deleteNewProduct);

module.exports = router;

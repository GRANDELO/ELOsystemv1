const express = require('express');
const router = express.Router();
const newproductController = require('../controllers/newproductController');


router.post('/updateShopLogo', (req, res, next) => {
    console.log('Middleware check:', req.headers.authorization || 'No auth');
    next();
  },
    newproductController.updateShopLogoController);
    
router.get('/newproducts', newproductController.getNewProducts);
router.get('/newproducts/:id', newproductController.getNewProductById);
router.put('/newproducts/:id', newproductController.updateNewProduct);
router.delete('/newproducts/:id', newproductController.deleteNewProduct);
router


module.exports = router;

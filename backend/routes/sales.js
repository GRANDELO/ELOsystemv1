const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/', salesController.createSale);
router.get('/', salesController.getAllSales);
router.get('/:id', salesController.getSaleById);
router.put('/:id', salesController.updateSale);
router.delete('/:id', salesController.deleteSale);

module.exports = router;

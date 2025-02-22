const express = require('express');
const router = express.Router();

const { createReturn, getAllReturns, getReturnById, updateReturnStatus} = require('../controllers/return');

router.post('/return', createReturn);
router.get('/admin-return', getAllReturns);
router.get('/admin-return/:id', getReturnById);
router.post('/adminreturn-update', updateReturnStatus);

module.exports = router;
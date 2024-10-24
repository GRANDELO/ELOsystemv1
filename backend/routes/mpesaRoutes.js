// routes/mpesaRoutes.js
const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// Route to initiate STK Push
router.post('/stkpush', mpesaController.sendSTKPush);

// Route to handle MPesa callback (Optional)
router.post('/mpesa-response', mpesaController.handleMpesaCallback);

module.exports = router;

// routes/coresell.js

const express = require('express');
const router = express.Router();
const { createCoreSellOrder } = require('../controllers/coresellController');

// POST endpoint for initiating a core sell
router.post('/initiate', createCoreSellOrder);

module.exports = router;

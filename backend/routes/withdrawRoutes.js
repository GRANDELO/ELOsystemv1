// routes/withdrawRoutes.js
const express = require('express');
const { withdraw, getWithdrawalsByUsername } = require('../controllers/withdrawalController');
const router = express.Router();

// Route to handle withdrawal
router.post('/', withdraw);

// Route to get all withdrawals for a specific user
router.get('/withdrawals/:username', getWithdrawalsByUsername);

module.exports = router;

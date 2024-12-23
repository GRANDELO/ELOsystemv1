// routes/withdrawRoutes.js
const express = require('express');
const { withdraw, getWithdrawalsByUsername, } = require('../controllers/withdrawalController');
const { awithdraw, agetWithdrawalsByUsername, } = require('../controllers/agentscontroller');
const { dpwithdraw, dpgetWithdrawalsByUsername,} = require('../controllers/deliverypersoncontroller');
const router = express.Router();

// Route to handle withdrawal
router.post('/', withdraw);
router.get('/withdrawals/:username', getWithdrawalsByUsername);

router.post('/agent/', awithdraw);
router.get('/agent/withdrawals/:username', agetWithdrawalsByUsername);

router.post('/delivery/', dpwithdraw);
router.get('/delivery/withdrawals/:username', dpgetWithdrawalsByUsername);

module.exports = router;

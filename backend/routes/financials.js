const express = require('express');
const router = express.Router();
const financialsController = require('../controllers/CompanyFinancials'); // Adjust path if necessary

// Route to get financial summary
router.get('/summary', financialsController.getFinancialSummary);

module.exports = router;

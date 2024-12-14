const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');


router.post('/submit', submitFeedback);
router.get('/', getAllFeedback);

module.exports = router;


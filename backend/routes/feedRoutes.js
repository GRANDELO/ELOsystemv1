const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/FeedControllers');


router.post('/submit', submitFeedback);
router.get('/', getAllFeedback);

module.exports = router;


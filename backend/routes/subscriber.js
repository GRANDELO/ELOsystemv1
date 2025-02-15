const express = require('express');
const router = express.Router();
const subscriber = require('../controllers/emailCampaign');

router.post('/subscribe', subscriber.footerSubscribe);

module.exports = router;
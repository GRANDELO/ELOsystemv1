const express = require('express');
const router = express.Router();
const subscriber = require('../controllers/emailCampaign');

router.post('/subscribe', subscriber.footerSubscribe);
router.post('/newsletter', subscriber.NewsLetter);
router.post('/send-newsletter', subscriber.SendNewsletter);

module.exports = router;
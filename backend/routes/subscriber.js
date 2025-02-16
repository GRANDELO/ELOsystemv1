const express = require('express');
const router = express.Router();
const multer = require('multer');
const {footerSubscribe, NewsLetter, SendNewsletter} = require('../controllers/emailCampaign');

const upload = multer();

router.post('/subscribe', footerSubscribe);
router.post('/newsletter', upload.single('file'), NewsLetter);
router.post('/send-newsletter', SendNewsletter);

module.exports = router;
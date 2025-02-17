const express = require('express');
const router = express.Router();
const multer = require('multer');
const {footerSubscribe, NewsLetter, SendNewsletter, emailSeller} = require('../controllers/emailCampaign');

const upload = multer();

router.post('/subscribe', footerSubscribe);
router.post('/newsletter', upload.single('file'), NewsLetter);
router.post('/send-newsletter', SendNewsletter);
router.post('/seller-email',  emailSeller,);

module.exports = router;
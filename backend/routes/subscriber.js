const express = require('express');
const router = express.Router();
const multer = require('multer');
const {footerSubscribe, NewsLetter, SendNewsletter, emailSeller} = require('../controllers/emailCampaign');
const EmailTemplate = require('../models/EmailTemplate');

const upload = multer();

router.post('/subscribe', footerSubscribe);
router.post('/newsletter', upload.single('file'), NewsLetter);
router.post('/send-newsletter', SendNewsletter);
router.get('/template-seller', async (req, res) => {
    try {
        const templates = await EmailTemplate.find({});
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
    }
});
router.post('/seller-email',  emailSeller,);
router.delete('/cancel-email/:id', (req, res) => {
    const { id } = req.params;
    if (scheduledJobs[id]){
        scheduledJobs[id].stop();
    delete scheduledJobs[id];
        return res.status(200).json({ message: 'Scheduled email canceled successfully' });
    }
    return res.status(404).json({ message: 'Scheduled email not found' });
});

module.exports = router;
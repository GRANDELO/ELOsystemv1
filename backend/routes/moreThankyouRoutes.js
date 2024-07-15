const express = require('express');
const { moreThankyouMessage } = require('../controllers/moreThankyouController');
const router = express.Router();

router.post('/morethankyou', moreThankyouMessage);

module.exports = router;

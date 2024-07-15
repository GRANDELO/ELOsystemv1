const express = require('express');
const { welcomeMessage } = require('../controllers/homeController');
const router = express.Router();

router.get('/', welcomeMessage);

module.exports = router;

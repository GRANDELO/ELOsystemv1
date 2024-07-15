const express = require('express');
const { sendName } = require('../controllers/nameController');
const router = express.Router();

router.get('/name', sendName);

module.exports = router;

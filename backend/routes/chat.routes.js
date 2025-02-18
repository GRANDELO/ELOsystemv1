// routes/chat.routes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Endpoint for processing chat messages
router.post('/message', chatController.getChatResponse);

// Endpoint for adding new Q&A pairs
router.post('/qa', chatController.addQAPair);

module.exports = router;

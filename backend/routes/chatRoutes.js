const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Create a new chat
router.post('/create', chatController.createChat);

// Send a message
router.post('/send', chatController.sendMessage);

// Delete a message for me
router.patch('/deleteForMe/:chatId/:messageId', chatController.deleteMessageForMe);

// Delete a message for all
router.patch('/deleteForAll/:chatId/:messageId', chatController.deleteMessageForAll);

// Mark as delivered
router.patch('/markAsDelivered/:chatId/:messageId', chatController.markAsDelivered);

// Mark as read
router.patch('/markAsRead/:chatId/:messageId', chatController.markAsRead);

module.exports = router;

const express = require('express');
const pushNotificationController = require('../controllers/pushNotificationController');

const router = express.Router();

// Route to subscribe a user to push notifications
router.post('/subscribe', pushNotificationController.subscribeUser);

// Route to unsubscribe a user from push notifications
router.post('/unsubscribe', pushNotificationController.unsubscribeUser);

// Route to send push notifications to all subscribers
router.post('/send-notification', pushNotificationController.sendNotification);

module.exports = router;

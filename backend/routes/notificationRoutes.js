const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/pushnotificationController');

// Subscribe Route
router.post('/subscribe', notificationController.subscribe);

// Unsubscribe Route
router.post('/unsubscribe', notificationController.unsubscribe);

// Send Notification Route
router.post('/sendNotification', notificationController.sendNotification);

module.exports = router;

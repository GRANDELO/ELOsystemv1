// routes/notifications.js
const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();


router.post('/', createNotification);
router.get('/:userId', getUserNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;

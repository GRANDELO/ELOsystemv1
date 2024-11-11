// routes/notifications.js
const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  generateQr,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', generateQr);
router.post('/', createNotification);
router.get('/:username', getUserNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;

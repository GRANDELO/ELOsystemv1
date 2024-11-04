const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  const { username, message, topic } = req.body; // Include topic if applicable
  try {
    const notification = new Notification({ username, message, topic });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

const increateNotification = async (username, message, topic) => {
  try {
    const notification = new Notification({ username, message, topic });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.username }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notifications' });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  increateNotification,
};

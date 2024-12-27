const Notification = require('../models/Notification');
const QRCode = require('qrcode');
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
    const notification = new Notification({ userId: username, message, topic });
    await notification.save();
    console.log(notification);
    return(notification);
  } catch (error) {
    console.log(`Failed to create notification ${error}`);
    return'Failed to create notification';
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

const generateQr = async (req, res) => {
  const iosLink = 'https://apps.apple.com/app/id<your-app-id>';
  const androidLink = 'https://play.google.com/store/apps/details?id=<your.package.name>';
  
  // Alternatively, use a unified link if you created one
  const appLink = '<your-unified-link>';

  try {
    // Generate the QR code image for the link
    const qrCodeData = await QRCode.toDataURL(appLink);
    
    // Send the QR code as a response
    res.send(`<img src="${qrCodeData}" alt="QR Code for app download" />`);
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    res.status(500).send('Error generating QR code');
  }

}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  increateNotification,
  generateQr,
};

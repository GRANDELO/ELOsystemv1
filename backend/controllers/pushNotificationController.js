const webPush = require('../utils/webPushConfig');
const Subscription = require('../models/Subscription');

// Subscribe user
exports.subscribeUser = async (req, res) => {
    try {
      const { endpoint, keys } = req.body;
      if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
        return res.status(400).json({ message: 'Invalid subscription data' });
      }
  
      const subscription = new Subscription({ endpoint, keys });
      await subscription.save();
      res.status(201).json({ message: 'Subscription saved.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
// Unsubscribe user
exports.unsubscribeUser = async (req, res) => {
    try {
        await Subscription.deleteOne({ endpoint: req.body.endpoint });
        res.status(200).json({ message: 'Unsubscribed.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send notification to all subscribers
exports.sendNotification = async (req, res) => {
    try {
        // Retrieve all subscriptions from the database
        const subscriptions = await Subscription.find({});

        // Customizable payload based on request parameters
        const payload = JSON.stringify({
            title: req.body.title || 'New Notification',
            body: req.body.body || 'Hello from your backend!',
            icon: req.body.icon || '/icon.png',             // Default icon path
            badge: req.body.badge || '/badge.png',          // Default badge path
            url: req.body.url || '/',                       // URL to open when the notification is clicked
            tag: req.body.tag || 'general-notification',    // Tag for grouping
            renotify: req.body.renotify !== false           // Re-alert user if not specified as false
        });

        // Send notification to each subscription, handling failures individually
        const sendPromises = subscriptions.map(sub =>
            webPush.sendNotification(sub, payload).catch(err => {
                console.error(`Failed to send notification to ${sub.endpoint}:`, err);
                // Handle subscription cleanup or logging as needed
            })
        );

        await Promise.all(sendPromises); // Await all notifications
        res.status(200).json({ message: 'Notifications sent!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


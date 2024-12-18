const webPush = require('../utils/webPushConfig');
const Subscription = require('../models/Subscription');

// Save subscription to database with username
exports.subscribeUser = async (req, res) => {
    try {
      const { subscription, username } = req.body;
      if (!subscription || !username) {
        return res.status(400).json({ message: 'Subscription data or username missing' });
      }
  
      const { endpoint, keys } = subscription;
  
      // Save subscription and username to the database
      const newSubscription = new Subscription({ endpoint, keys, username });
      await newSubscription.save();
      res.status(201).json({ message: 'Subscription saved with username.' });
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

// Send notification to a specific user
exports.sendNotificationToUser = async (req, res) => {
    try {
      const { username } = req.body;
      const subscription = await Subscription.findOne({ username });
  
      if (!subscription) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const payload = JSON.stringify({
        title: req.body.title || 'New Notification',
        body: req.body.body || 'Hello from your backend!',
        icon: req.body.icon || '/icon.png',             // Default icon path
        badge: req.body.badge || '/badge.png',          // Default badge path
        url: req.body.url || '/',                       // URL to open when the notification is clicked
        tag: req.body.tag || 'general-notification',    // Tag for grouping
        renotify: req.body.renotify !== false           // Re-alert user if not specified as false
    });
  
      await webPush.sendNotification(subscription, payload);
      res.status(200).json({ message: `Notification sent to ${username}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  /*
  all users
  '{
    "title": "Custom Notification Title",
    "body": "This is a more detailed notification body sent from the backend.",
    "icon": "",
    "badge": "",
    "url": "https://grandelo.web.app/salespersonhome",
    "tag": "custom-tag",
    "renotify": true
}'


  single user
  '{
    "username": "kinyi", 
    "title": "Custom personal Notification Title",
    "body": "This is a more detailed notification body sent from the backend.",
    "icon": "",
    "badge": "",
    "url": "https://grandelo.web.app/salespersonhome",
    "tag": "custom-tag",
    "renotify": true
}'

*/
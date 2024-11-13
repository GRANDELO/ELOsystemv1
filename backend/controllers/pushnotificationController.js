require('dotenv').config();
const webPush = require('web-push');
const Subscription = require('../models/Subscription');

// Set VAPID keys for web-push
webPush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.subscribe = async (req, res) => {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json({ message: 'Subscription saved.' });
};

exports.unsubscribe = async (req, res) => {
    await Subscription.deleteOne({ endpoint: req.body.endpoint });
    res.status(200).json({ message: 'Unsubscribed.' });
};

exports.sendNotification = async (req, res) => {
    const subscriptions = await Subscription.find({});
    const notificationPayload = JSON.stringify({
        title: 'New Notification',
        body: 'Hello from backend!',
    });

    const sendPromises = subscriptions.map(sub =>
        webPush.sendNotification(sub, notificationPayload)
    );

    Promise.all(sendPromises)
        .then(() => res.status(200).json({ message: 'Notifications sent!' }))
        .catch(err => {
            console.error('Error sending notification:', err);
            res.sendStatus(500);
        });
};

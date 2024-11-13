const webPush = require('../utils/webPushConfig');
const Subscription = require('../models/Subscription');

// Subscribe user
exports.subscribeUser = async (req, res) => {
    try {
        const subscription = new Subscription(req.body);
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
        const subscriptions = await Subscription.find({});
        const payload = JSON.stringify({
            title: 'New Notification',
            body: 'Hello from your backend!',
        });

        const sendPromises = subscriptions.map(sub =>
            webPush.sendNotification(sub, payload)
        );

        await Promise.all(sendPromises);
        res.status(200).json({ message: 'Notifications sent!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

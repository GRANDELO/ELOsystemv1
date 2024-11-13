const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true },
    keys: {
        auth: String,
        p256dh: String
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: { type: String, unique: true}
})

module.exports = mongoose.model('Subscriber', subscriberSchema);
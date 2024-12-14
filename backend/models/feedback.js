const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    username: { type: String, required: true },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

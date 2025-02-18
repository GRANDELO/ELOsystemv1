const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., seller-reminder, maintenance
    subject: { type: String, required: true },
    html: { type: String, required: true }, // HTML content of the email
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
// models/PendingJob.js
const mongoose = require('mongoose');

const pendingJobSchema = new mongoose.Schema({
    callbackData: { type: Object, required: true }, // Store the callback payload
    processed: { type: Boolean, default: false },    // Track if the job is processed
    createdAt: { type: Date, default: Date.now },    // Optional: Timestamp for tracking job creation
});

module.exports = mongoose.model('PendingJob', pendingJobSchema);

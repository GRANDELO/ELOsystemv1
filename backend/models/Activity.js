const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    description: String,
    createdAt: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('Activity', ActivitySchema);

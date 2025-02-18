// models/Config.js
const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  timeWindowMinutes: { type: Number, default: 20160 }, // Default time window in minutes
  threshold: { type: Number, default: 10 }, // Default threshold for direct vs hub
});

module.exports = mongoose.model('Config', ConfigSchema);
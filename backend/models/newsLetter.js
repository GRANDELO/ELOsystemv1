const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String, default: null },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
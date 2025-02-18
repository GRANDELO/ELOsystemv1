// models/qa.model.js
const mongoose = require('mongoose');

const QASchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('QAPair', QASchema);

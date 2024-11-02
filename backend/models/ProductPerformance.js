const mongoose = require('mongoose');

const productPerformanceSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  seller: { type: String, required: true },
  saleDates: { type: [Date], default: [] }
});

module.exports = mongoose.model('ProductPerformance', productPerformanceSchema);

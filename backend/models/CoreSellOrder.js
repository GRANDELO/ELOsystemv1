// models/CoreSellOrder.js

const mongoose = require('mongoose');

const coreSellOrderSchema = new mongoose.Schema({
  mpesaNumber: { type: String, required: true },
  username: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewProduct', required: true },
  sellerOrderId: { type: String, required: true }, // New field for seller's unique order ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CoreSellOrder', coreSellOrderSchema);

const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Sale', SaleSchema);

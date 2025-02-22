const mongoose = require('mongoose');

const returnRequest = new mongoose.Schema({
    orderNumber: {type: String, required: true},
    reason: { type: String, required: true },
    condition: { type: String, required: true },
    resolution: { type: String, required: true },
    comments: { type: String },
    file: { type: String }, 
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("returnRequest", returnRequest);
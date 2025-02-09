const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true, default: () => `ROUTE-${uuidv4()}` },
  origin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  status: { type: String, enum: ['scheduled', 'in_transit', 'delivered'], default: 'scheduled' },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
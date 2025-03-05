const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true, default: () => `ROUTE-${uuidv4()}` },
  origin: { 
    county: { type: String, required: true },
    town: { type: String, required: true },
    area: { type: String, required: true },
    specific: { type: String, required: true },
  },

  destination: { 
    county: {type: String, required: true},
    town: {type: String, required: true},
    area: {type: String, required: true},
    specific: { type: String, required: true },
  },
  orderNumber:[{type: String, unique: true }],
  status: { type: String, enum: ['Pending', 'scheduled', 'in_transit', 'delivered'], default: 'scheduled' },
  productId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
  type: {type: String, enum:['direct', 'hub'], required: true},
  additionalInfo: {
    sellerPhoneNumber: { type: String },
    clientPhoneNumber: { type: String },
    agentPhoneNumber: { type: String },
  },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;


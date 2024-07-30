const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['available', 'assigned'], default: 'available' },
});

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);

module.exports = DeliveryPerson;

const mongoose = require('mongoose');

const deliveryPersonnelSchema = new mongoose.Schema({
  name: String,
  phone_number: String,
  vehicle_type: String,
  status: { type: String, default: 'available' }
});

module.exports = mongoose.model('DeliveryPersonnel', deliveryPersonnelSchema);

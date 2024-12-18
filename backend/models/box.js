const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const boxSchema = new mongoose.Schema({
  boxNumber: {
    type: String,
    default: uuidv4, 
  },
  boxid: {type: String, required: true},
  items: [{
    orderNumber: {type: String,default: uuidv4, },
  }],
  agentnumber: {type: String, required: true},
  destination: { type: String, required: true },
  packingDate: { type: Date, default: Date.now },
  packed: { type: Boolean, default: false },
  deliveryPerson: { type: String, required: true }, 
  isDeliveryInProcess: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  currentplace: { type: String, required: true },
});

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;

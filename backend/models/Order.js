const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    default: uuidv4, // Automatically generate a unique order number
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewProduct', required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  destination: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson' }, // Assign delivery person
  isDeliveryInProcess: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  username: { type: String, required: true }, // Add username
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

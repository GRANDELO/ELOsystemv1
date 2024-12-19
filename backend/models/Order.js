const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderNumber: {type: String,required: true },
  orderid : {type: String, required: true},
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewProduct', required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paid: {type: Boolean, required: true },
  destination: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  packed: {type: Boolean, defautlt: false},
  isDeliveryInProcess: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  username: { type: String, required: true },
  CheckoutRequestID: { type: String},
  orderReference: { type: String, required: true },
  sellerOrderId: { type: String, default: undefined},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

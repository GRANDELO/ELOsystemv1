const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderNumber: {type: String,required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewProduct', required: true },
    quantity: { type: Number, required: true },
    pOrderNumbe: {type: String,required: true },
    pCurrentPlace: { type: String, required: true, default: "Waiting for delivery." },
    variations: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewProduct', required: false },
        color: { type: String },
        size: [{ type: String }],
        material: { type: String },
        model: { type: String },
      },
    ],
  }],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paid: {type: Boolean, required: true },
  destination: {
    county: {type: String, required: true},
    town: {type: String, required: true},
    area: {type: String, required: true},
   },
  orderDate: { type: Date, default: Date.now },
  packed: {type: Boolean, defautlt: false},
  isDeliveryInProcess: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  username: { type: String, required: true },
  CheckoutRequestID: { type: String},
  orderReference: { type: String, required: true },
  sellerOrderId: { type: String, default: undefined},
  origin: { 
    county: { type: String, required: true },
    town: { type: String, required: true },
    area: { type: String, required: true },
  }, 
  status: {type:String, enum: ['pending', 'packed', 'in_transit','delivered' ], default: 'pending'},
  currentplace: { type: String, required: true, default: "Waiting for delivery." },

});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


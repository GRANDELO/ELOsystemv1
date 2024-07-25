const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new Schema({
  user: {
    type: String, // Changed from ObjectId to String to store the username
    required: true,
  },
  items: [CartItemSchema],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;

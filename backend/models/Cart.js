const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'NewProduct',
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
    type: String,
    required: true,
  },
  items: [CartItemSchema],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;

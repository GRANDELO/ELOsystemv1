const mongoose = require('mongoose');
const { Schema } = mongoose;

const newproductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const NewProduct = mongoose.model('NewProduct', newproductSchema);
module.exports = NewProduct;

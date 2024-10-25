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
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
  image: {
    type: String, // Store image URL
  },
}, { timestamps: true });

const NewProduct = mongoose.model('NewProduct', newproductSchema);
module.exports = NewProduct;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  images: [String],
  
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

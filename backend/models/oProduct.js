const mongoose = require('mongoose');

// Assuming you already have the Review model
const Review = require('./Review'); // Import the Review model

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true },
    username: { type: String, required: true },
    productId: { type: String, unique: true, required: true },
    discount: { type: Boolean, default: false },
    discountpersentage: { type: Number, default: undefined },
    lable: { type: String, default: undefined },
    quantity: { type: Number, required: true },
    images: [String],
    features: [
      {
        type: { type: String },
        specification: { type: String },
      },
    ],
    variations: [
      {
        color: [{ type: String }],
        size: [{ type: String }],
        material: [{ type: String }],
        model: [{ type: String }],
      },
    ],
    type: { type: String, default: undefined }, // New field
    collaborators: { 
      type: [
        {
          username: { type: String }, // Collaborator's username
          amount: { type: Number },  // Money to be paid to the collaborator
        },
      ], 
      default: undefined 
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review', // Reference to the Review model
      }
    ], // New field to store reviews
    
    searchCount: { type: Number, default: 0 },  // Aggregate search count for the product
    clickCount: { type: Number, default: 0 }, 
  },

  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

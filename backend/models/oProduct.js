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
    yearOfManufacture: { type: Number, min: 1900, max: new Date().getFullYear(), default: undefined },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    features: { type: [String], default: []  },// List of unique selling points or highlights 
    technicalDetails: { type: Map, of: String, default: {} }, // Key-value pairs for advanced technical details
    dimensions: { 
      type: {
        height: { type: Number, default: null },
        width: { type: Number, default: null },
        depth: { type: Number, default: null },
        weight: { type: Number, default: null }
      },
      default: null 
    },
    manufacturerDetails: { 
      type: {
        name: { type: String },
        contactInfo: { type: String }
      },
      default: null 
    },
    warranty: { type: String, default: null }, // Warranty info


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
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

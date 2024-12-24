const mongoose = require('mongoose');

// Assuming you already have the Review model
const Review = require('./Review'); // Import the Review model

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 }, // Ensuring price is non-negative
    username: { type: String, required: true },
    productId: { type: String, unique: true, required: true },
    discount: { type: Boolean, default: false },
    discountPercentage: { type: Number, min: 0, max: 100 }, // Fixed camelCase and added validation
    label: { type: String }, // Fixed typo
    quantity: { type: Number, required: true, min: 0 }, // Ensure quantity is non-negative
    images: {
      type: [String], // Validating that it’s an array of strings
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every((url) => typeof url === 'string'),
        message: 'Images must be an array of strings.',
      },
    },
    features: {
      type: [
        {
          type: { type: String, required: true }, // Collaborator's type
          specification: { type: String, required: true }, // Specification for the feature
        },
      ],
      default: [],
    },
    variations: [
      {
        color: String,
        size: [String],
        material: String,
        model: String,
      },
    ],
    type: { type: String }, // Optional field
    collaborators: {
      type: [
        {
          username: { type: String, required: true }, // Collaborator's username
          amount: { type: Number, required: true, min: 0 }, // Ensure non-negative amount
        },
      ],
      default: [],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review', // Reference to the Review model
      },
    ], // Field to store reviews
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

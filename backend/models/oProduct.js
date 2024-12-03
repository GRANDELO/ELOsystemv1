const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    username: { type: String, required: true },
    productId: { type: String, unique: true, required: true },
    discount: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: undefined },
    label: { type: String, default: undefined },
    quantity: { type: Number, required: true },
    images: [String],
    type: { type: String, default: undefined }, // New field
    collaborators: { 
      type: [
        {
          username: { type: String }, // Collaborator's username
          amount: { type: Number },  // Money to be paid to the collaborator
        },
      ], 
      default: undefined 
    }, // New field
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

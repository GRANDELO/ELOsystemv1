const mongoose = require('mongoose');
const Product = require('../models/Product');

// Create a new product
const postProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product = new Product({ name, description, price, category });

    try {
      await product.save();
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (saveError) {
      console.error('Error creating product:', saveError);
      res.status(500).json({ message: 'Error creating product', saveError });
    }
  } catch (error) {
    console.error('Error posting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const updatedProduct = { name, description, price, category };

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  postProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct
};

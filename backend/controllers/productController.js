// productController.js

const productService = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.file);
    res.status(201).json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.file);
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.status(200).json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
};

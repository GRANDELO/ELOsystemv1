const productService = require('../services/productService');

const productController = {
  async getProduct(req, res) {
    try {
      const product = await productService.getProduct(req.params.id);
      res.status(200).json({ product });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async createProduct(req, res) {
    try {
      const imageId = req.file ? req.file.id : null;
      const productData = { ...req.body, imageId };
      const product = await productService.createProduct(productData);
      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({ product });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const message = await productService.deleteProduct(req.params.id);
      res.status(200).json(message);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = productController;

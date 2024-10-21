const NewProduct = require('../models/oProduct');
const { v4: uuidv4 } = require('uuid');

exports.createNewProduct = async (req, res) => {
  try {
    const { name, category, subCategory, price, description, username, quantity } = req.body;
    const productId = uuidv4();
    const newNewProduct = new NewProduct({
      name,
      category,
      subCategory,
      price,
      description,
      username,
      productId,
      quantity,
    });
    await newNewProduct.save();
    res.status(201).json(newNewProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewProducts = async (req, res) => {
  try {
    const newProducts = await NewProduct.find();
    res.status(200).json(newProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewProductById = async (req, res) => {
  try {
    const newProduct = await NewProduct.findById(req.params.id);
    if (!newProduct) {
      return res.status(404).json({ error: 'NewProduct not found' });
    }
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNewProduct = async (req, res) => {
  try {
    const updatedNewProduct = await NewProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNewProduct) {
      return res.status(404).json({ error: 'NewProduct not found' });
    }
    res.status(200).json(updatedNewProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNewProduct = async (req, res) => {
  try {
    const deletedNewProduct = await NewProduct.findByIdAndDelete(req.params.id);
    if (!deletedNewProduct) {
      return res.status(404).json({ error: 'NewProduct not found' });
    }
    res.status(200).json({ message: 'NewProduct deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

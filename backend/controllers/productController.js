
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    imageUrl
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product', error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

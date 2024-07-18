const Product = require('../models/Product');
const { uploadFile } = require('../utils/googleDrive');
const fs = require('fs');

exports.createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  try {
    const driveResponse = await uploadFile(image.path, image.filename);
    const imageUrl = driveResponse.webViewLink;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl
    });

    const savedProduct = await newProduct.save();

    // Remove the uploaded file from the server
    fs.unlinkSync(image.path);

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

// controllers/uploadController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('../utils/googleDriveService');
const Product = require('../models/Product'); // Adjust the path as necessary

const storage = multer.memoryStorage(); // Use memory storage to handle files in-memory
const upload = multer({ storage });

const uploadProductImage = upload.single('image'); // Handle single image upload

const postProduct = async (req, res) => {
  try {
    uploadProductImage(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const tempFilePath = path.join(__dirname, file.originalname);
      fs.writeFileSync(tempFilePath, file.buffer); // Save file temporarily

      const fileLink = await uploadFile(tempFilePath, file.mimetype);
      fs.unlinkSync(tempFilePath); // Delete the file after upload

      const { name, description, price, category } = req.body;
      const product = new Product({
        name,
        description,
        price,
        category,
        imageUrl: fileLink, // Store Google Drive link
      });

      await product.save();

      res.status(201).json({ message: 'Product created successfully', product });
    });
  } catch (error) {
    console.error('Error posting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

const updateProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });

    const { name, description, price, category } = req.body;
    const file = req.file;

    let updatedProduct = { name, description, price, category };

    if (file) {
      const tempFilePath = path.join(__dirname, file.originalname);
      fs.writeFileSync(tempFilePath, file.buffer);

      const fileLink = await uploadFile(tempFilePath, file.mimetype);
      fs.unlinkSync(tempFilePath);

      updatedProduct.imageUrl = fileLink;
    }

    try {
      const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      res.status500().json({ message: 'Error updating product' });
    }
  });
};

module.exports = {
  postProduct,
  getProduct,
  getProducts,
  updateProduct,
};

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

module.exports = {
  postProduct,
};


const { generateFilePath } = require('../utils/fileHelper');
const fs = require('fs');
const multer = require('multer');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Asset = require('../models/User');

async function uploadFiles(files) {
    if (!files || files.length === 0) return [];
  
    // Use `map` to upload all files and return an array of promises
    const uploadPromises = files.map(async (file) => {
      const fileName = Date.now() + '-' + file.originalname; // Generate unique file name
      const fileUpload = bucket.file(fileName);
  
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      return new Promise((resolve, reject) => {
        stream.on('error', (err) => reject(err));
        stream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          console.log("Uploaded image:", publicUrl);
          resolve(publicUrl);
        });
        stream.end(file.buffer);
      });
    });
  
    // Await all promises and return array of URLs
    return Promise.all(uploadPromises);
  }
  
  // Create product
  // Create product with multiple images
  exports.uploadAssets = async (req, res) => {
    try {
      const { name, category, subCategory, description, price, username, quantity } = req.body;
  
      // Upload multiple images if available
      const imageUrls = req.files && req.files.length > 0 ? await uploadFiles(req.files) : [];
      console.log("Uploaded images:", imageUrls);
  
      const productId = uuidv4();
      const Asset = new Asset({
        name,
        category,
        subCategory,
        description,
        price,
        username,
        productId,
        quantity,
        images: imageUrls,  // Store array of image URLs
      });
  
      await newProduct.save();
      res.status(201).json({ product: newProduct });
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
//uploadAssets
// API for uploading assets
const handleUpload = async (req, res) => {
  try {
    const { files } = req;
    if (!files || !files.background || !files.logo) {
      return res.status(400).json({ error: 'Both background and logo are required' });
    }

    const backgroundUrl = `/uploads/backgrounds/${files.background[0].filename}`;
    const logoUrl = `/uploads/logos/${files.logo[0].filename}`;

    const newAsset = new Asset({ backgroundUrl, logoUrl });
    await newAsset.save();

    res.status(201).json({
      message: 'Assets uploaded successfully!',
      backgroundUrl,
      logoUrl,
    });
  } catch (error) {
    console.error('Error uploading assets:', error);
    res.status(500).json({ error: 'Failed to upload assets' });
  }
};

// API to retrieve stored assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.findOne().sort({ createdAt: -1 }).limit(1); // Fetch the latest asset
    if (!assets) {
      return res.status(404).json({ error: 'No assets found' });
    }
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error retrieving assets:', error);
    res.status(500).json({ error: 'Failed to retrieve assets' });
  }
};

module.exports = { handleUpload, getAssets };

const Product = require('../models/oProduct');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Upload a file to Firebase Storage
async function uploadFile(file) {
  if (!file) return null;

  const fileName = Date.now() + path.extname(file.originalname); // Generate a unique file name
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      // Get the public URL for the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      console.log("image", publicUrl);
      resolve(publicUrl);
    });
    stream.end(file.buffer);
  });
}

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, description, price, username, quantity } = req.body;
    const image = req.file ? await uploadFile(req.file) : null;
    console.log("error image", image);
    const productId = uuidv4();
    const newProduct = new Product({
      name,
      category,
      subCategory,
      description,
      price,
      username,
      productId,
      quantity,
      image,
    });

    await newProduct.save();
    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);  // Add this log to see the exact error
    res.status(500).json({ error: error.message });
  }
};


// Get product by ID

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    if (req.file) {
      updateData.image = await uploadFile(req.file); // Update image if a new one is provided
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get all items
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json({ products });
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


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Serve image from Firebase Storage
exports.getImage = async (req, res) => {
  try {
    const file = bucket.file(req.params.filename);

    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${req.params.filename}`;
    res.redirect(publicUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

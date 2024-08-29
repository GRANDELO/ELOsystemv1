const Product = require('../models/oProduct');
const { bucket } = require('../config/firebase');
const path = require('path');

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
      resolve(publicUrl);
    });
    stream.end(file.buffer);
  });
}

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? await uploadFile(req.file) : null;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
    });

    await newProduct.save();
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  console.log(`Fetching product with ID: ${req.params.id}`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
};

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

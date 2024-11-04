const Product = require('../models/oProduct');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ProductPerformance = require('../models/ProductPerformance');

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

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { field, value } = req.body; // Expecting { field: "name", value: "New Name" }

  try {
    // Check if the field is allowed to be updated
    const allowedFields = ['name', 'description', 'price', 'quantity'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: `Invalid field name provided: ${field}.` });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { [field]: value },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully.', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting product.' });
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

exports.getProductPerformanceByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Get username from request parameters

    // Find all products with the specified username
    const products = await ProductPerformance.find({ username });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No product performance records found for this user.' });
    }

    // Return product performance details
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return res.status(500).json({ message: 'Failed to fetch product performance' });
  }
};
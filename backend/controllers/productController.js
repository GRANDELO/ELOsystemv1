const Product = require('../models/oProduct');
const { bucket } = require('../config/firebase'); // Import bucket from firebase.js
const path = require('path');

// Upload a file
async function uploadFile(file) {
  if (!file) return null;
  
  const filePath = path.join('images', file.originalname); // Define your file path
  const fileUpload = bucket.file(filePath);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', () => resolve(filePath));
    stream.end(file.buffer);
  });
}

  
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? await uploadFile(req.file) : null;
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image
    });
    
    await newProduct.save();
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: updatedProduct });
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

// Serve image
exports.getImage = async (req, res) => {
  try {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ message: 'No file exists' });
      }
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

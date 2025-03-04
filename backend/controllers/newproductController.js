const NewProduct = require('../models/oProduct');
const Shop = require('../models/User');

const { v4: uuidv4 } = require('uuid');
const { bucket } = require('../config/firebase');
const path = require('path');

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

exports.updateShopLogoController = async function (req, res) {
  const { username } = req.body;

  try {
    console.log("Received request", req.body, req.files);

    if (!req.files || !req.files.logo || !req.files.background) {
      return res.status(400).json({ message: 'Logo and background are required.' });
    }

    // Ensure file paths are stored as strings, not arrays
    const logoUrl = await uploadFile(req.files.logo); // Get string URL
    const backgroundUrl = await uploadFile(req.files.background); // Get string URL

    const updatedShop = await Shop.findOneAndUpdate(
      { username },
      { logoUrl: logoUrl, backgroundUrl: backgroundUrl }, // Convert to string
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Files uploaded successfully.', updatedShop });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files.', error: error.message });
  }
};



exports.getNewProducts = async (req, res) => {
  try {
    // Parse query parameters or use default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Get the total count of new products
    const totalProducts = await NewProduct.countDocuments();

    // Fetch only the required products for this page
    const newProducts = await NewProduct.find().skip(skip).limit(limit);

    res.status(200).json({
      products: newProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
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




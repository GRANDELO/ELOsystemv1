const Product = require('../models/oProduct');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ProductPerformance = require('../models/ProductPerformance');
const User = require('../models/User');

// Upload a file to Firebase Storage
// Function to upload multiple files
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
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      description,
      price,
      username,
      quantity,
      type,
      yearOfManufacture,
      specifications,
      features,
      technicalDetails,
      dimensions,
      manufacturerDetails,
      warranty,
      collaborators, // Expect an array of collaborators
    } = req.body;
    console.log(specifications);
    // Upload multiple images if available
    const imageUrls =
      req.files && req.files.length > 0 ? await uploadFiles(req.files) : [];
    console.log("Uploaded images:", imageUrls);

    const productId = uuidv4();

    // Check the type and set collaborators accordingly
    const collaboratorData =
      type === "collaborator" && collaborators
        ? collaborators
        : undefined;

    const newProduct = new Product({
      name,
      category,
      subCategory,
      description,
      price,
      username,
      productId,
      discount: undefined,
      discountPercentage: undefined,
      label: undefined,
      quantity,
      images: imageUrls, // Store array of image URLs
      type,
      collaborators: collaboratorData, // Set collaborators if type is "collaborator"
      yearOfManufacture,
      specifications,
      features,
      technicalDetails,
      dimensions,
      manufacturerDetails,
      warranty,
    });

    await newProduct.save();
    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
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
    const newProduct = await Product.findById(req.params.id);
    if (!newProduct) {
      return res.status(404).json({ error: 'NewProduct not found' });
    }
    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { field, value } = req.body; // Expecting { field: "name", value: "New Name" }

  try {
    // Check if the field is allowed to be updated
    const allowedFields = ['name', 'description', 'price', 'quantity', 'discount', 'discountpersentage', 'lable'];
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
    const products = await ProductPerformance.find({ seller: username });
    if (!products)
      {
        return res.status(404).json({ message: 'No product performance records found for this user.' });
      }
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


exports.updateshoplogoUrl = async (req, res) => {
  try {
    const { username } = req.body;

    console.log("Processing request for:", username);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract logo and background files
    const logoFile = req.files.logo ? req.files.logo[0] : null;
    const backgroundFile = req.files.background ? req.files.background[0] : null;

    const logoUrl = logoFile ? await uploadFiles([logoFile]) : null;
    const backgroundUrl = backgroundFile ? await uploadFiles([backgroundFile]) : null;

    console.log("Uploaded logo image URL:", logoUrl);
    console.log("Uploaded background image URL:", backgroundUrl);

    // Update user with uploaded URLs
    user.logoUrl = logoUrl;
    user.backgroundUrl = backgroundUrl;

    await user.save();

    return res.status(200).json({
      message: 'Images uploaded successfully',
      logoUrl,
      backgroundUrl,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};



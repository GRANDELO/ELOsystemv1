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

exports.updateUserImages = async (req, res) => {
  try {
    const { username } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedUrls = await uploadFiles(files); // Upload files and get URLs
    const [logoUrl, backgroundUrl] = uploadedUrls; // Assuming two files are uploaded: logo and background

    const user = await User.findOneAndUpdate(
      { username },
      { logoUrl, backgroundUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Images updated successfully',
      user: {
        logoUrl: user.logoUrl,
        backgroundUrl: user.backgroundUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
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
      collaborators,
      features,
      variations,
    } = req.body;


    const imageUrls =
      req.files && req.files.length > 0 ? await uploadFiles(req.files) : [];
    console.log("Uploaded images:", imageUrls);

    const productId = uuidv4();

    const collaboratorData =
      type === "collaborator" && collaborators ? collaborators : undefined;

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
      images: imageUrls,
      type,
      collaborators: collaboratorData,
      features: JSON.parse(features || "[]"),
      variations: JSON.parse(variations || "[]"),
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

exports.trackProductInteraction = async (req, res) => {
  const { userId, productId, category, actionType } = req.body; // actionType can be 'search' or 'click'

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Track the click or search in the user's history
    if (actionType === 'click') {
      // Update the click history
      user.history.click.set(productId, (user.history.click.get(productId) || 0) + 1);
      
      // Update the product's click count
      const product = await Product.findOne({ productId });
      if (product) {
        product.clickCount += 1;
        await product.save();
      }
    } else if (actionType === 'search') {
      // Update the search history
      user.history.search.set(category, (user.history.search.get(category) || 0) + 1);
      
      // Update the products' search counts in the given category
      const products = await Product.find({ category });
      products.forEach(async (product) => {
        product.searchCount += 1;
        await product.save();
      });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Interaction tracked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get combined statistics for search and click histories
exports.getUserStatistics = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send back combined search and click statistics
    res.json({
      searchHistory: user.history.search,
      clickHistory: user.history.click,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getFilteredProducts = async (req, res) => {
  const { userId, category, subCategory, maxPrice, brand } = req.query;

  try {
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all products and filter based on user's preferences
    let filteredProducts = await Product.find();

    // Filter products by category and subcategory if provided
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    if (subCategory) {
      filteredProducts = filteredProducts.filter(product => product.subCategory.toLowerCase() === subCategory.toLowerCase());
    }

    // Filter by price and brand if provided
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(product => product.brand && product.brand.toLowerCase() === brand.toLowerCase());
    }

    // Now sort products based on user preferences (search and click history)
    filteredProducts.sort((a, b) => {
      // Boost products based on the user's search history
      const aSearchBoost = user.history.search.get(a.category) || 0;
      const bSearchBoost = user.history.search.get(b.category) || 0;

      // Boost products based on the user's click history
      const aClickBoost = user.history.click.get(a.productId) || 0;
      const bClickBoost = user.history.click.get(b.productId) || 0;

      // Combine search and click boosts
      const aTotalBoost = aSearchBoost + aClickBoost;
      const bTotalBoost = bSearchBoost + bClickBoost;

      // Sort products by the combined boost (higher boost comes first)
      if (aTotalBoost !== bTotalBoost) {
        return bTotalBoost - aTotalBoost; // prioritize the one with higher boost
      }

      // Fallback sorting by price or other criteria
      return a.price - b.price; // (optional: you can add more sorting logic based on other preferences)
    });

    res.json({ products: filteredProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
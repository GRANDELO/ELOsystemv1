const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Product = require('../models/Product');

// Initialize GridFS
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = multer.memoryStorage(); // Use memory storage to handle files in-memory
const upload = multer({ storage });

//const uploadProductImage = upload.single('image');  Handle single image upload

const postProduct = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const file = req.file;
      if (!file && !req.body.imageUrl) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      let imageUrl = req.body.imageUrl; // If image is not uploaded, use existing imageUrl
      if (file) {
        // Store file in GridFS
        const fileUploadStream = gfs.createWriteStream({
          filename: file.originalname,
          contentType: file.mimetype,
        });
        fileUploadStream.end(file.buffer);

        fileUploadStream.on('close', (uploadedFile) => {
          imageUrl = `/files/${uploadedFile.filename}`;
          createProduct();
        });
      } else {
        createProduct();
      }

      function createProduct() {
        const { name, description, price, category } = req.body;
        const product = new Product({
          name,
          description,
          price,
          category,
          imageUrl, 
        });

        product.save()
          .then((product) => res.status(201).json({ message: 'Product created successfully', product }))
          .catch((error) => res.status(500).json({ message: 'Error creating product', error }));
      }
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
      // Store file in GridFS
      const fileUploadStream = gfs.createWriteStream({
        filename: file.originalname,
        contentType: file.mimetype,
      });
      fileUploadStream.end(file.buffer);

      fileUploadStream.on('close', async (uploadedFile) => {
        updatedProduct.imageUrl = `/files/${uploadedFile.filename}`;
        try {
          const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
          res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
          res.status(500).json({ message: 'Error updating product' });
        }
      });
    } else {
      try {
        const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product });
      } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
      }
    }
  });
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Route to serve images from GridFS
const getImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'No file found' });
    }

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.pipe(res);
  });
};

module.exports = {
  postProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getImage,
};

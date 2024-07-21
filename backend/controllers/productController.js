const multer = require('multer');
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

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image'); // Use single file upload

const postProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });

    const { name, description, price, category } = req.body;

    if (req.file) {
      const fileUploadStream = gfs.createWriteStream({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      fileUploadStream.write(req.file.buffer);
      fileUploadStream.end();

      fileUploadStream.on('close', async (uploadedFile) => {
        const imageUrl = `/files/${uploadedFile.filename}`;
        const product = new Product({ name, description, price, category, imageUrl });

        try {
          await product.save();
          res.status(201).json({ message: 'Product created successfully', product });
        } catch (saveError) {
          res.status(500).json({ message: 'Error saving product' });
        }
      });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  });
};

const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });

    const { name, description, price, category } = req.body;
    let updatedProduct = { name, description, price, category };

    if (req.file) {
      const fileUploadStream = gfs.createWriteStream({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      fileUploadStream.write(req.file.buffer);
      fileUploadStream.end();

      fileUploadStream.on('close', async (uploadedFile) => {
        updatedProduct.imageUrl = `/files/${uploadedFile.filename}`;
        try {
          const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
          res.status(200).json({ message: 'Product updated successfully', product });
        } catch (updateError) {
          res.status(500).json({ message: 'Error updating product' });
        }
      });
    } else {
      try {
        const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product });
      } catch (updateError) {
        res.status(500).json({ message: 'Error updating product' });
      }
    }
  });
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
  getImage,
};

const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Product = require('../models/Product');
const { conn } = require('../services/gridFsConfig');

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = multer.memoryStorage(); // Use memory storage to handle files in-memory
const upload = multer({ storage });

const postProduct = async (req, res) => {
  try {
    req.upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const file = req.file;
      const { name, description, price, category, imageUrl: existingImageUrl } = req.body;

      if (!file && !existingImageUrl) {
        return res.status(400).json({ message: 'No file uploaded or image URL provided' });
      }

      let imageUrl = existingImageUrl; // Use the provided image URL if no file is uploaded

      if (file) {
        const filename = `${Date.now()}_${file.originalname}`;

        try {
          const writeStream = gfs.createWriteStream({ filename });
          writeStream.end(file.buffer);

          writeStream.on('close', async (file) => {
            imageUrl = `/files/${file.filename}`;
            const product = new Product({ name, description, price, category, imageUrl });

            try {
              await product.save();
              res.status(201).json({ message: 'Product created successfully', product });
            } catch (saveError) {
              console.error('Error creating product:', saveError);
              res.status(500).json({ message: 'Error creating product', saveError });
            }
          });

          writeStream.on('error', (uploadError) => {
            console.error('Error storing file in GridFS:', uploadError);
            res.status(500).json({ message: 'Error storing file in GridFS', uploadError });
          });
        } catch (streamError) {
          console.error('Error handling write stream:', streamError);
          res.status(500).json({ message: 'Error handling write stream', streamError });
        }
      } else {
        // No file uploaded, use existing image URL
        const product = new Product({ name, description, price, category, imageUrl });

        try {
          await product.save();
          res.status(201).json({ message: 'Product created successfully', product });
        } catch (saveError) {
          console.error('Error creating product:', saveError);
          res.status(500).json({ message: 'Error creating product', saveError });
        }
      }
    });
  } catch (error) {
    console.error('Error posting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateProduct = async (req, res) => {
  req.upload.single('image')(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading file' });

    const { name, description, price, category } = req.body;
    const file = req.file;

    let updatedProduct = { name, description, price, category };

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      const writeStream = gfs.createWriteStream({ filename });
      writeStream.end(file.buffer);

      writeStream.on('close', async (uploadedFile) => {
        updatedProduct.imageUrl = `/files/${uploadedFile.filename}`;
        try {
          const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
          res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
          res.status(500).json({ message: 'Error updating product' });
        }
      });

      writeStream.on('error', (uploadError) => {
        res.status(500).json({ message: 'Error storing file in GridFS', uploadError });
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

    const readStream = gfs.createReadStream({ filename: file.filename });
    readStream.pipe(res);
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

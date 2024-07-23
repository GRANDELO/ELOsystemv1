const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Product = require('../models/Product');
const { conn } = require('../services/gridFsConfig');

// Initialize GridFS
let gfs;
conn.once('open', () => {
  console.log('Connected to MongoDB for GridFS');
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

      const { name, description, price, category } = req.body;
      const file = req.file;
      let imageUrl = '';

      if (file) {
        const filename = `${Date.now()}_${file.originalname}`;
        const writeStream = gfs.createWriteStream({ filename });
        writeStream.end(file.buffer);
        riteStream.on('error', (uploadError) => {
          console.error('Error storing file in GridFS:', uploadError);
          return res.status(500).json({ message: 'Error storing file in GridFS', uploadError });
        });

        writeStream.on('close', async (file) => {
          console.log('File written to GridFS:', file.filename);
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
      } else {
        const product = new Product({ name, description, price, category });
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
  try {
    req.upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const { name, description, price, category } = req.body;
      const file = req.file;
      let imageUrl = '';

      if (file) {
        const filename = `${Date.now()}_${file.originalname}`;
        const writeStream = gfs.createWriteStream({ filename });
        writeStream.end(file.buffer);

        writeStream.on('error', (uploadError) => {
          console.error('Error storing file in GridFS:', uploadError);
          return res.status(500).json({ message: 'Error storing file in GridFS', uploadError });
        });

        writeStream.on('close', async (file) => {
          
          imageUrl = `/files/${file.filename}`;
          const productUpdates = { name, description, price, category, imageUrl };

          try {
            await productUpdates.save();
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productUpdates, { new: true });
            res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
          } catch (updateError) {
            console.error('Error updating product:', updateError);
            res.status(500).json({ message: 'Error updating product', updateError });
          }
        });

        writeStream.on('error', (uploadError) => {
          console.error('Error storing file in GridFS:', uploadError);
          res.status(500).json({ message: 'Error storing file in GridFS', uploadError });
        });
      } else {
        const productUpdates = { name, description, price, category };

        try {
          await productUpdates.save();
          const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productUpdates, { new: true });
          res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
        } catch (updateError) {
          console.error('Error updating product:', updateError);
          res.status(500).json({ message: 'Error updating product', updateError });
        }
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
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

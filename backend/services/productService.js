const Product = require('../models/Product');
const { getBucket } = require('../config/gridFsConfig');
const fs = require('fs');

const createProduct = async (data, file) => {
    const newProduct = new Product(data);
  
    if (file) {
      const filePath = path.join(__dirname, '../uploads', file.filename); // Path to the file
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
  
      const bucket = getBucket();
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });
  
      fs.createReadStream(filePath).pipe(uploadStream);
      uploadStream.on('finish', () => {
        newProduct.imageId = uploadStream.id;
        newProduct.save();
      });
    } else {
      await newProduct.save();
    }
  
    return newProduct;
  };
  
  const updateProduct = async (id, data, file) => {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
  
    Object.assign(product, data);
    if (file) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
  
      const bucket = getBucket();
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });
  
      fs.createReadStream(filePath).pipe(uploadStream);
      uploadStream.on('finish', () => {
        product.imageId = uploadStream.id;
        product.save();
      });
    } else {
      await product.save();
    }
    return product;
  };

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');

  if (product.imageId) {
    const bucket = getBucket();
    await bucket.delete(product.imageId);
  }
  return product;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  if (product.imageId) {
    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStream(product.imageId);
    product.imageStream = downloadStream;
  }
  return product;
};

const getAllProducts = async () => {
  const products = await Product.find();
  for (const product of products) {
    if (product.imageId) {
      const bucket = getBucket();
      const downloadStream = bucket.openDownloadStream(product.imageId);
      product.imageStream = downloadStream;
    }
  }
  return products;
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
};

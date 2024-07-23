const Product = require('../models/Product');
const { getBucket } = require('../config/gridFsConfig');
const fs = require('fs');
const path = require('path');

const createProduct = async (data, file) => {
  const newProduct = new Product(data);

  if (file) {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    try {
      // Pipe the file to GridFS
      await new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(uploadStream);

        fileStream.on('end', () => resolve());
        fileStream.on('error', (error) => reject(error));
        uploadStream.on('error', (error) => reject(error));
        uploadStream.on('finish', () => {
          newProduct.imageId = uploadStream.id;
          resolve();
        });
      });

      await newProduct.save();
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error uploading file');
    }
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
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    try {
      // Pipe the file to GridFS
      await new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(uploadStream);

        fileStream.on('end', () => resolve());
        fileStream.on('error', (error) => reject(error));
        uploadStream.on('error', (error) => reject(error));
        uploadStream.on('finish', () => {
          product.imageId = uploadStream.id;
          resolve();
        });
      });

      await product.save();
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error uploading file');
    }
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

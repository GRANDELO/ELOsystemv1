const { getBucket } = require('../config/gridFsConfig');
const { ObjectId } = require('mongodb');

const productService = {
  async getProduct(id) {
    const db = getBucket().database;
    const product = await db.collection('products').findOne({ _id: ObjectId(id) });
    if (product) {
      const image = await getBucket().find({ _id: ObjectId(product.imageId) }).toArray();
      return { ...product, image: image[0] };
    }
    throw new Error('Product not found');
  },

  async createProduct(data) {
    const db = getBucket().database;
    const result = await db.collection('products').insertOne(data);
    return result.ops[0];
  },

  async updateProduct(id, data) {
    const db = getBucket().database;
    const result = await db.collection('products').updateOne({ _id: ObjectId(id) }, { $set: data });
    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }
    return db.collection('products').findOne({ _id: ObjectId(id) });
  },

  async deleteProduct(id) {
    const db = getBucket().database;
    const result = await db.collection('products').deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error('Product not found');
    }
    return { message: 'Product deleted successfully' };
  },

  async uploadImage(file) {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname);
    file.stream.pipe(uploadStream);
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });
  },
};

module.exports = productService;

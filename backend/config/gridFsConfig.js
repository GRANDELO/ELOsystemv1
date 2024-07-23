const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

let bucket;

const initializeGridFSBucket = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = connection.connection.db;
    bucket = new GridFSBucket(db, {
      bucketName: 'images',
    });

    console.log('GridFSBucket initialized');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

initializeGridFSBucket();

const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket is not initialized');
  }
  return bucket;
};

module.exports = { getBucket };

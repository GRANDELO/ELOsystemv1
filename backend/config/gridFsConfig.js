const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

let bucket;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db();
    bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });
    console.log('Connected to MongoDB and GridFS');
  } catch (error) {
    console.error('Error connecting to MongoDB and GridFS', error);
    process.exit(1);
  }
};

const getBucket = () => bucket;

module.exports = { connectDB, getBucket };

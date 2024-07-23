const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
conn.once('open', () => {
  console.log('Connected to MongoDB for GridFS');
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = multer.memoryStorage(); // Use memory storage to handle files in-memory
const upload = multer({ storage });

module.exports = { upload, gfs, conn };

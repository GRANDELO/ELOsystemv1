const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS is ready');
});

module.exports = { gfs, conn };

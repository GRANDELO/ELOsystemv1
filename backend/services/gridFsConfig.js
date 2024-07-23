const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
const conn = mongoose.connection; // Simplified connection

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // Specify the collection
});

module.exports = { gfs, conn };

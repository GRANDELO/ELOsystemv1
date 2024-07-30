const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Init gfs
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

module.exports = { conn, gfs };

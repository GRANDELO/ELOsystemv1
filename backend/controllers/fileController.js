const { gfs } = require('../models/db');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const mongoURI = 'your_mongodb_connection_string';

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: `file_${Date.now()}${path.extname(file.originalname)}`,
      bucketName: 'uploads'
    };
  }
});
const upload = multer({ storage });

const uploadFile = upload.single('image');

const uploadFileHandler = (req, res) => {
  res.json({ file: req.file });
};

const getFiles = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    return res.json(files);
  });
};

const getFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    return res.json(file);
  });
};

const displayImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
};

const deleteFile = (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.json({ success: true });
  });
};

module.exports = {
  uploadFile,
  uploadFileHandler,
  getFiles,
  getFile,
  displayImage,
  deleteFile
};

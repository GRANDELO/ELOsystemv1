const express = require('express');
const router = express.Router();
const { upload } = require('../services/gridFsConfig');

// Upload an image
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(201).send(req.file);
});

// Get an image by filename
router.get('/file/:filename', (req, res) => {
  req.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).send('No file exists.');
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = req.gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).send('Not an image.');
    }
  });
});

// Get all files
router.get('/files', (req, res) => {
  req.gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).send('No files exist.');
    }
    res.json(files);
  });
});

module.exports = router;

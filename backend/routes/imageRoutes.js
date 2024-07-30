const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage, getImages } = require('../controllers/imageController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), uploadImage);
router.get('/images', getImages);

module.exports = router;

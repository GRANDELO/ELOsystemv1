const cloudinary = require('cloudinary').v2;
const Image = require('../models/Image');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newImage = new Image({
      filename: result.public_id,
      url: result.secure_url
    });

    await newImage.save();
    res.status(200).send('Image uploaded successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).send(err);
  }
};

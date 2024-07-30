const Image = require('../models/Image');
const path = require('path');

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const newImage = new Image({
    filename: req.file.filename,
    contentType: req.file.mimetype,
    imageBase64: req.file.path
  });

  try {
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

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/upload', fileController.uploadFile, fileController.uploadFileHandler);
router.get('/files', fileController.getFiles);
router.get('/files/:filename', fileController.getFile);
router.get('/image/:filename', fileController.displayImage);
router.delete('/files/:id', fileController.deleteFile);

module.exports = router;

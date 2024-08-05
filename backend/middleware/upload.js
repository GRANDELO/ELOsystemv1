// upload.js (middleware)
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for Firebase

const upload = multer({ storage });

module.exports = upload;

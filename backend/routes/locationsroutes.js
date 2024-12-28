const express = require('express');
const { getAllLocations } = require('../controllers/location'); // Adjust path
const router = express.Router();

router.get('/api/locationsroutes', getAllLocations);

module.exports = router;

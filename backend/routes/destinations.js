const express = require('express');
const router = express.Router();
const { groupProductsByOriginAndDestination } =  require('../controllers/location_pac');

router.get('/api/destinations', groupProductsByOriginAndDestination);

module.exports = router;
const express = require('express');
const router = express.Router();
const { planDeliveryLocations } =  require('../controllers/location_pac');



router.post('/plan-delivery', planDeliveryLocations);

module.exports = router
const express = require('express');
const router = express.Router();
const { planDeliveryLocations, groupProductsByOriginAndDestination, getDestinations } =  require('../controllers/location_pac');

router.get('/destinations', getDestinations);

  router.post('/plan-delivery', planDeliveryLocations);

module.exports = router
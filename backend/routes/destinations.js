const express = require('express');
const router = express.Router();
const { planDeliveryLocations, adminReplan, getConfig,  updateConfig, } =  require('../controllers/location_pac');



router.post('/plan-delivery', planDeliveryLocations);
router.post('/replan-routes',  adminReplan);
router.get('/config', getConfig);
router.put('/update', updateConfig);

module.exports = router
const express = require('express');
const router = express.Router();
const { planDeliveryLocations, adminReplan, getConfig,  updateConfig, listRoutes, updateOrder, updateRoute } =  require('../controllers/location_pac');



router.post('/plan-delivery', planDeliveryLocations);
router.post('/replan-routes',  adminReplan);
router.get('/config', getConfig);
router.put('/update', updateConfig);
router.get('/routes', listRoutes);
router.put('/orders/:orderId', updateOrder);
router.put('/routes/:routeId', updateRoute);

module.exports = router
const express = require('express');
const router = express.Router();
const BuyerController = require('../controllers/userController');

router.get('/buyersTrack', BuyerController.getAllBuyers);
router.patch('/disable/:userId', BuyerController.disableBuyers);
router.patch('/undo-disable/:userId', BuyerController.undoDisableBuyers);
router.get('/active', BuyerController.getActiveBuyers);
router.get('/disabled', BuyerController.getDisabledBuyers);
router.get('/unverified', BuyerController.getUnverifiedBuyers);

module.exports = router;

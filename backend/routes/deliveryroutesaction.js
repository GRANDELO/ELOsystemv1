const express = require('express');
const router = express.Router();
const UserController = require('../controllers/deliveryController');
const { check } = require('express-validator');

// Show all users
router.get('/users', UserController.getAllUsers);

// Disable a user
router.patch('/disable/:userId', UserController.disableUser);

// Undo disable a user
router.patch('/undo-disable/:userId', UserController.undoDisableUser);

// Show a graph of registration dates
router.get('/registration-graph', UserController.getRegistrationDatesGraph);

// Show active users
router.get('/active', UserController.getActiveUsers);

// Show disabled users
router.get('/disabled', UserController.getDisabledUsers);

// Show unverified users
router.get('/unverified', UserController.getUnverifiedUsers);

// Add this import at the top of your file
// Your existing router code
router.patch(
  '/update-payment-price',
  [
    check('deliveryPersonId', 'Delivery person ID is required').not().isEmpty(),
    check('paymentPrice', 'Payment price should be a number').isNumeric()
  ],
  UserController.updatePaymentPrice
);


module.exports = router;

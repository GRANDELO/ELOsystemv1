const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Show all users
router.get('/users', UserController.getAllUsers);

// Disable a user
router.patch('/user/disable/:userId', UserController.disableUser);

// Undo disable a user
router.patch('/user/undo-disable/:userId', UserController.undoDisableUser);

// Show a graph of registration dates
router.get('/users/registration-graph', UserController.getRegistrationDatesGraph);

// Show active users
router.get('/users/active', UserController.getActiveUsers);

// Show disabled users
router.get('/users/disabled', UserController.getDisabledUsers);

// Show unverified users
router.get('/users/unverified', UserController.getUnverifiedUsers);

module.exports = router;

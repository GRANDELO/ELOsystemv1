const express = require('express');
const router = express.Router();
const UserController = require('../controllers/employment');

// Show all users
router.get('/users', UserController.getAllUsers);

// Disable a user
router.patch('/disable/:userId', UserController.disableUser);

// Undo disable a user
router.patch('/undo-disable/:userId', UserController.undoDisableUser);

// Show active users
router.get('/active', UserController.getActiveUsers);

// Show disabled users
router.get('/disabled', UserController.getDisabledUsers);


module.exports = router;

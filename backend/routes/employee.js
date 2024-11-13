const express = require('express');
const router = express.Router();
const employmentController = require('../controllers/employment');

// Show all users
router.get('/users', employmentController.getAllUsers);

// Disable a user
router.patch('/disable/:userId', employmentController.disableUser);

// Undo disable a user
router.patch('/undo-disable/:userId', employmentController.undoDisableUser);

// Show active users
router.get('/active', employmentController.getActiveUsers);

// Show disabled users
router.get('/disabled', employmentController.getDisabledUsers);


module.exports = router;

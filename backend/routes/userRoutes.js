const express = require('express');
const { getAllUsers, getUsersPerMonth } = require('../controllers/userController');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public (Change to private with authentication middleware later)
router.get('/', getAllUsers);
router.get('/users-per-month', getUsersPerMonth);


module.exports = router;

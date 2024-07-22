const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public (Change to private with authentication middleware later)
router.get('/', getAllUsers);

module.exports = router;

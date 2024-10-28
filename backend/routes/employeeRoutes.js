// routes/employeeRoutes.js
const express = require('express');
const { registerEmployee } = require('../controllers/employeeController');
const router = express.Router();

// POST request to register an employee
router.post('/register', registerEmployee);

module.exports = router;

// routes/employeeRoutes.js
const express = require('express');
const { registerEmployee, login } = require('../controllers/employeeController');
const router = express.Router();

// POST request to register an employee
router.post('/register', registerEmployee);
router.post('/login', login);

module.exports = router;

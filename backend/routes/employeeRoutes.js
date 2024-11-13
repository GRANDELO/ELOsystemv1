// routes/employeeRoutes.js
const express = require('express');
const { registerEmployee, login, getEmployees, addEmployee, updateEmployee, deleteEmployee} = require('../controllers/employeeController');
const router = express.Router();

// POST request to register an employee
router.post('/register', registerEmployee);
router.post('/login', login);

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;

// routes/employeeRoutes.js
const express = require('express');
const { registerEmployee, login } = require('../controllers/employeeController');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// POST request to register an employee
router.post('/register', registerEmployee);
router.post('/login', login);

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.addEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;

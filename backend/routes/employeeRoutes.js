// routes/employeeRoutes.js
const express = require('express');
const { registerEmployee, login, getAllEmployees, getActiveEmployees, getDisabledEmployee, disableEmployee, undoDisableEmployee } = require('../controllers/employeeController');
const router = express.Router();

// POST request to register an employee
router.post('/register', registerEmployee);
router.post('/login', login);
router.get('/', getAllEmployees);
router.get('/getactiveemployees', getActiveEmployees);
router.get('/getdisabledemployee', getDisabledEmployee);
router.patch('/disable/:userId', disableEmployee);
router.patch('/undodisable/:userId', undoDisableEmployee);

module.exports = router;

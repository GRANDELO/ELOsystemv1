// controllers/employeeController.js
const Employee = require('../models/Employee');

// Create a new employee
const registerEmployee = async (req, res) => {
    const { firstName, surname, eid, role } = req.body;

    try {
        const employee = new Employee({ firstName, surname, eid, role });
        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully', employee });
    } catch (error) {
        res.status(400).json({ message: 'Error registering employee', error });
    }
};

module.exports = { registerEmployee };

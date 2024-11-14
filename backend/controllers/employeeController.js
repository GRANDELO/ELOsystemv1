const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
require('dotenv').config();

// Register a new employee
const registerEmployee = async (req, res) => {
    const { firstName, surname, eid, role, password } = req.body;

    const user = await Employee.findOne({ eid });
    if (user) {
        return res.status(401).json({ message: 'Eid exists' });
    }
    try {
        const workID = eID;
        const employee = new Employee({ firstName, surname, workID, role, password });
        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully', employee });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error registering employee', error });

    }
};

// Employee login
const login = async (req, res) => {
    const { eid, password } = req.body;
  
    try {
        const user = await Employee.findOne({ workID: eid });
        if (!user) {
            return res.status(401).json({ message: 'Invalid EID' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        user.active = true;
        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                eid: user.eid,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.json({
            message: 'Login successful',
            token,
            name: user.firstName,
            role: user.role,
            eid: user.eid,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const getAllEmployees = async (req, res) => {
    try {
      const employee = await Employee.find();
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Employee', error });
    }
  };

module.exports = { 
    registerEmployee,
    login,
    getAllEmployees
};

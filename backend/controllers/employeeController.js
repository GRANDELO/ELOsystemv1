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

const getActiveEmployees = async (req, res) => {
    try {
      const activeEmployee = await Employee.find({ active: true });
      res.status(200).json(activeEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active employee', error });
    }
  };

const getDisabledEmployee = async (req, res) => {
try {
    const disabledEmployee = await Employee.find({ isDisabled: true });
    res.status(200).json(disabledEmployee);
} catch (error) {
    res.status(500).json({ message: 'Error fetching disabled users', error });
}
};

// Disable a user
const disableEmployee = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await Employee.findByIdAndUpdate(userId, { isDisabled: true }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User disabled successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error disabling user', error });
    }
  };
  
  // Undo disable a user
const undoDisableEmployee = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await Employee.findByIdAndUpdate(userId, { isDisabled: false }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User reactivated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error reactivating user', error });
    }
  };


module.exports = { 
    registerEmployee,
    login,
    getAllEmployees,
    getActiveEmployees,
    getDisabledEmployee,
    disableEmployee,
    undoDisableEmployee
};

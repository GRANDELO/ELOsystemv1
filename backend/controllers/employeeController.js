const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
require('dotenv').config();
const moment = require('moment');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');
require('dotenv').config();

// Register a new employee
const registerEmployee = async (req, res) => {
    const { firstName, surname, email, eid, role, password } = req.body;

    const user = await Employee.findOne({ workID: eid });
    if (user) {
        return res.status(401).json({ message: 'Work ID exists' });
    }
    const euser = await Employee.findOne({ email });
    if (euser) 
      {
      return res.status(401).json({ message: 'Email exists' });
      }
    try {
        const workID = eid;
        const employee = new Employee({ firstName, surname, email, workID, role, password, resetPasswordToken: undefined, resetPasswordExpires: undefined });
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
                WorkID: user.workID,
                username: user.workID,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.json({
            message: 'Login successful',
            token,
            name: user.firstName,
            role: user.role,
            workID: user.workID,
            email: user.email,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const logout = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await Employee.findOne({ workID: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.active = false;
    await user.save();

    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: 'Logout failed.' });
  }
};

const changepassword = async (req, res) => {
  const { workID, newPassword } = req.body;

  try {
    const user = await Employee.findOne({ workID });
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    user.password = newPassword;
    await user.save();
    const token = jwt.sign(
        {
            id: user._id,
            WorkID: user.workID,
            username: user.workID,
            role: user.role,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Password updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating password' });
  }
};


const newrecoverPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await Employee.findOne({ workID: username });

    if (!user) {
      console.log(`user not found `+ username );
      return res.status(404).json({ message: 'User not found' + username });
      
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.passwordRecoveryToken = token;
    user.tokenExpiry = moment().add(1, 'hour').toDate();
    

    // Send the recovery email
    const subject = 'Password Reset Request';
    const message = `Dear ${user.firstName},

    We received a request to reset your password. To proceed, please use the token provided below:
    
    Password Reset Token: ${user.passwordRecoveryToken}
    
    Alternatively, you can reset your password by following this link: https://grandelo.web.app/admpasswordreset
    
    This token is valid for 1 hour. If you did not request a password reset, please ignore this message.
    
    Best regards,
    Bazelink Support Team`;
    
    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
        Password Reset Request
      </h2>
      <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
        Dear ${user.firstName},<br> We received a request to reset your password. To proceed, please use the token provided below:
      </p>
      <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
        <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
          Password Reset Token: <span style="color: #1d4ed8;">${user.passwordRecoveryToken}</span>
        </p>
      </div>
      <p style="text-align: center;">
        <a href="https://grandelo.web.app/admpasswordreset" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
          Reset Your Password
        </a>
      </p>
      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        This token is valid for 1 hour. If you did not request a password reset, please disregard this email.
      </p>
      <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
        Best regards,<br> Bazelink Support Team
      </p>
    </div>
  `;
  
    try {
      await sendEmail(user.email, subject, message, htmlMessage);
      await user.save();
      res.status(200).json({ message: 'Password recovery email sent successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending password recovery email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during password recovery.' });
  }
};

const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordRecoveryToken !== verificationCode) {
      return res.status(400).json({ message: 'Invalid token' + verificationCode + ' ' + user.passwordRecoveryToken });
    }

    if (moment().isAfter(user.tokenExpiry)) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    user.password = newPassword;
    user.passwordRecoveryToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during password reset.' });
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
    logout,
    changepassword,
    newrecoverPassword,
    resetPassword,

    getAllEmployees,
    getActiveEmployees,
    getDisabledEmployee,
    disableEmployee,
    undoDisableEmployee
};

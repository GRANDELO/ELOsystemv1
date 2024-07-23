const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode } = require('../services/verificationcode');
const sendEmail = require('../services/emailService');
require('dotenv').config();

const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword, phoneNumber, username, dateOfBirth, gender, category } = req.body;

  const isDateValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    return enteredDate <= today;
  };

  const isDate12Valid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 12));
    return enteredDate < minAgeDate;
  };

  const isDate85Valid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    const maxAgeDate = new Date(today.setFullYear(today.getFullYear() - 85));
    return enteredDate > maxAgeDate;
  };

  if (!isDateValid(dateOfBirth)) {
    return res.status(400).json({ message: 'Date cannot be past today.' });
  } else if (!isDate12Valid(dateOfBirth)) {
    return res.status(400).json({ message: 'You have to be at least 12 years old to join this site.' });
  } else if (!isDate85Valid(dateOfBirth)) {
    return res.status(400).json({ message: 'You have to be less than 85 years old to join this site.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  } else if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  } else if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
  } else if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
  } else if (!/\d/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one number.' });
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one special character.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification code
    const alphanumericCode = generateAlphanumericVerificationCode(6);
    const subject = "Verification - " + alphanumericCode;
    const vermessage = `Dear ${username},

Thank you for registering with Grandelo. Please use the following verification code to complete your registration:

Verification Code: ${alphanumericCode}

Follow this link https://grandelo.web.app/verification to verify your account

Best regards,
Grandelo`;

    // Send verification email
    try {
      await sendEmail(email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    // Format the date of birth using moment
    const formattedDateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');

    // Create new user
    user = new User({
      fullName,
      email,
      password,
      phoneNumber,
      username,
      dateOfBirth: formattedDateOfBirth,
      gender,
      category,
      verificationCode: alphanumericCode,
      isVerified: false,
      active: false,
      resetPasswordToken: "undefined",
      resetPasswordExpires: "undefined",
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {

  try {
    const newFields = {
      active: false,
    };

    const updateFields = {};
    for (const [key, value] of Object.entries(newFields)) {
        updateFields[key] = { $ifNull: [`$${key}`, value] };
    }
    

    await User.updateMany(
      {
        $or: Object.keys(newFields).map((key) => ({ [key]: { $exists: false } })),
      },
      { $set: newFields }
    );

    console.log('New fields added to users that were missing them');
  } catch (error) {
    console.error('Error updating users:', error);
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password '});
    }
    user.active = true;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token , category: user.category});
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Server error during verification:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  try {
    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with Grandelo. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://grandelo.web.app/verification to verify your account

Best regards,
Grandelo`;
    try {
      await sendEmail(email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating email' });
  }
};

const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(404).json({ message: 'User not found register first and try again.' });
    }


    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with Grandelo. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://grandelo.web.app/verification to verify your account

Best regards,
Grandelo`;
    try {
      await sendEmail(user.email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending verification code.' });
  }
};



const newrecoverPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.passwordRecoveryToken = token;
    user.tokenExpiry = moment().add(1, 'hour').toDate();
    

    // Send the recovery email
    const subject = 'Password Reset Request';
    const message = `Dear ${user.username},

You have requested to reset your password. Please use the following token to reset your password:

Password Reset Token: ${user.passwordRecoveryToken}

This token is valid for 1 hour. 

Best regards,
Grandelo`;

    try {
      await sendEmail(user.email, subject, message);
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordRecoveryToken !== verificationCode) {
      return res.status(400).json({ message: 'Invalid token' });
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

const logout = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

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

module.exports = logout;


module.exports = {
  registerUser,
  login,
  verifyUser,
  updateEmail,
  resendVerificationCode,
  newrecoverPassword,
  resetPassword,
  logout,
};

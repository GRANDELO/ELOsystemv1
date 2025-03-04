const User = require('../models/agents');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode, generateVerificationCode } = require('../services/verificationcode');
const sendEmail = require('../services/emailService');
require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Withdrawal = require('../models/Withdrawal');
const {b2cRequestHandler} = require("./mpesaController");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phoneNumber, idnumber, username, dateOfBirth, gender, locations } = req.body;

  const isDateWithinRange = (date, minYears, maxYears) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - minYears));
    const maxAgeDate = new Date(today.setFullYear(today.getFullYear() - maxYears));
    return enteredDate <= minAgeDate && enteredDate >= maxAgeDate;
  };

  if (!isDateWithinRange(dateOfBirth, 12, 85)) {
    return res.status(400).json({ message: 'Age must be between 12 and 85 to join.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }, { phoneNumber } , { idnumber } ] });
    if (user) {
      return res.status(400).json({ message: 'Agent already exists' });
    }
    const agentnumber = 'AG' + generateVerificationCode(4);
    // Generate verification code and send email
    const alphanumericCode = generateAlphanumericVerificationCode(6);
    const subject = `Verification - ${alphanumericCode}`;
    const vermessage = `Dear ${username},

    Thank you for registering with Bazelink! as our agent Please use the following verification code to complete your registration:
    
    Your agent number is ${agentnumber},

    Verification Code: ${alphanumericCode}
    
    You can also follow this link to verify your account: https://www.partner.bazelink.co.ke/verificationautoagent?email=${email}&code=${alphanumericCode}
    
    Best regards,
    Bazelink Support Team`;

    const htmlMessage = `
      <div style="font-family: 'Roboto', sans-serif; background: linear-gradient(145deg, #ffffff, #f9fafb); padding: 40px; border-radius: 20px; max-width: 700px; margin: auto; border: 2px solid transparent; background-clip: padding-box, border-box; border-image: linear-gradient(to right, #3b82f6, #6d28d9) 1; box-shadow: 0px 12px 35px rgba(0, 0, 0, 0.2);">
        <!-- Header Section -->
        <div style="background: linear-gradient(to right, #6d28d9, #3b82f6); padding: 40px; border-radius: 16px; text-align: center; color: white; margin-bottom: 30px; box-shadow: 0px 6px 15px rgba(59, 130, 246, 0.3);">
          <h1 style="font-size: 32px; margin: 0; font-weight: 700; letter-spacing: 1.5px;">
            Welcome, ${username}!
          </h1>
          <p style="margin-top: 10px; font-size: 18px; font-weight: 500;">
            We’re excited to have you on board at Bazelink.
          </p>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px 30px; text-align: center; background: white; border-radius: 16px; box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 18px; color: #374151; margin: 10px 0;">
            Your unique agent number is: <span style="font-weight: bold; color: #3b82f6;">${agentnumber}</span>.
          </p>
          <p style="font-size: 16px; color: #6b7280; margin: 20px 0;">
            To activate your account, enter the verification code below:
          </p>
      
          <!-- Verification Code Block -->
          <div style="margin: 30px auto; padding: 25px; font-size: 24px; font-weight: bold; color: #6d28d9; letter-spacing: 2px; border: 2px dashed #3b82f6; background: linear-gradient(135deg, #e9f2ff, #ffffff); border-radius: 12px; max-width: 320px; box-shadow: 0px 6px 15px rgba(59, 130, 246, 0.1);">
            ${alphanumericCode}
          </div>
      
          <p style="font-size: 16px; color: #374151; margin-top: 20px;">
            Click the button below to verify your account:
          </p>
      
          <!-- Verify Button -->
          <a href="https://www.partner.bazelink.co.ke/verificationautoagent?email=${email}&code=${alphanumericCode}" style="display: inline-block; margin-top: 20px; padding: 15px 40px; font-size: 18px; font-weight: bold; color: white; background: linear-gradient(to right, #3b82f6, #6d28d9); text-decoration: none; border-radius: 10px; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0px 4px 15px rgba(59, 130, 246, 0.4);">
            Verify Your Account
          </a>
        </div>
      
        <!-- Divider -->
        <hr style="border: none; height: 1px; background: linear-gradient(to right, #3b82f6, #6d28d9); margin: 40px 0;">
      
        <!-- Footer Section -->
        <div style="text-align: center; color: #6b7280;">
          <p style="font-size: 14px; margin-bottom: 10px;">
            If you didn’t request this email, no further action is required.
          </p>
          <p style="font-size: 14px;">
            Need help? Contact us at 
            <a href="mailto:sup.bazelink@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: bold;">support@bazelink.co.ke</a>.
          </p>
        </div>
      
        <!-- Legal Section -->
        <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">© 2025 Bazelink Inc. All rights reserved.</p>
        </footer>
      </div>
    `;

    try {
      await sendEmail(email, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    const formattedDateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');
    
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      idnumber,
      username,
      dateOfBirth: formattedDateOfBirth,
      gender,
      category: "Agent",
      agentnumber,
      verificationCode: alphanumericCode,
      isVerified: false,
      active: false,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      amount: 0,
      locations
    });
    await user.save();

    res.status(201).json({ message: 'Agent registered successfully' });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  

  try {
    console.log('Searching for user:', username);
    const user = await User.findOne({ $or: [{ email: username }, { username } , { agentnumber: username } ] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.active = true;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        category: user.category,
        agentnumber: user.agentnumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Handle `amount` field with proper checks
    let money;
    if (typeof user.amount === 'undefined') {
      money = undefined;
    } else {
      money = user.amount.toFixed(2);
    }

    console.log(user.amount);
    res.json({
      message: 'Login successful',
      token,
      category: user.category,
      username: user.username,
      amount: money,
    });
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
    const newuser = await User.findOne({ email: newEmail });
    if (newuser) {
      return res.status(404).json({ message: 'Email is in use find a different one' });
    }


    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    You can also follow this link to verify your account: https://www.partner.bazelink.co.ke/verificationautoagent?email=${newEmail}&code=${user.verificationCode}
    
    Best regards,
    Bazelink Support Team`;
    

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
    <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
      Welcome to Bazelink, ${user.username}!
    </h2>
    <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
      Thank you for registering with us! To complete your registration, please use the verification code below:
    </p>
    <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
      <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
        Verification Code: <span style="color: #1d4ed8;">${user.verificationCode}</span>
      </p>
    </div>
    <p style="text-align: center;">
      <a href="https://www.partner.bazelink.co.ke/verificationautoagent?email=${newEmail}&code=${user.verificationCode}" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
        Verify Your Account
      </a>
    </p>
    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
      If you did not request this, please disregard this email.
    </p>
    <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
      Best regards,<br> Bazelink Support Team
    </p>
  </div>
`;


    try {
      await sendEmail(newEmail, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    try {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          category: user.category,
          agentnumber: user.agentnumber,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      user.email = newEmail;
      await user.save();
      res.status(200).json({ message: 'Email updated successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred token' });
    }

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

    Thank you for joining Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    Alternatively, you can follow this link to verify your account: https://www.partner.bazelink.co.ke/verificationautoagent?email=${email}&code=${user.verificationCode}
    
    If you did not sign up for this account, please disregard this email.
    
    Best regards,
    Bazelink Team`;
    
    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
        Welcome to Bazelink, ${user.username}!
      </h2>
      <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
        Thank you for joining us! To finalize your registration, please use the following verification code:
      </p>
      <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
        <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
          Verification Code: <span style="color: #1d4ed8;">${user.verificationCode}</span>
        </p>
      </div>
      <p style="text-align: center;">
        <a href="https://www.partner.bazelink.co.ke/verificationautoagent?email=${newEmail}&code=${user.verificationCode}" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
          Verify Your Account
        </a>
      </p>
      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        If you did not sign up for this account, please disregard this email.
      </p>
      <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
        Best regards,<br> Bazelink Team
      </p>
    </div>
  `;
  
    try {
      await sendEmail(user.email, subject, vermessage, htmlMessage);
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

    We received a request to reset your password. To proceed, please use the token provided below:
    
    Password Reset Token: ${user.passwordRecoveryToken}
    
    Alternatively, you can reset your password by following this link: https://www.partner.bazelink.co.ke/agentpasswordreset
    
    This token is valid for 1 hour. If you did not request a password reset, please ignore this message.
    
    Best regards,
    Bazelink Support Team`;
    
    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
        Password Reset Request
      </h2>
      <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
        Dear ${user.username},<br> We received a request to reset your password. To proceed, please use the token provided below:
      </p>
      <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
        <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
          Password Reset Token: <span style="color: #1d4ed8;">${user.passwordRecoveryToken}</span>
        </p>
      </div>
      <p style="text-align: center;">
        <a href="https://www.partner.bazelink.co.ke/agentpasswordreset" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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

const changeusername = async (req, res) => {
  const { lemail, newUsername } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let checkuser = await User.findOne({ username: newUsername });
    if (checkuser) {
      return res.status(400).json({ message: 'Username already exists try a different one.' });
    }
    user.username = newUsername;
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        category: user.category,
        agentnumber: user.agentnumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Username updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Username' });
  }
};

const changepassword = async (req, res) => {
  const { lemail, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        category: user.category,
        agentnumber: user.agentnumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Password updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating password' });
  }
};

const changephonenumber = async (req, res) => {
  const { lemail, newPhoneNumber } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newuser = await User.findOne({ phoneNumber: newPhoneNumber });
    if (newuser) {
      return res.status(404).json({ message: 'Phone Number is in use by a different agent' });
    }

    user.phoneNumber = newPhoneNumber;
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        category: user.category,
        agentnumber: user.agentnumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Phone number updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating phone number' });
  }
};

const changeemail = async (req, res) => {
  const { lemail, newEmail } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let checkuser = await User.findOne({ email: newEmail });
    if (checkuser) {
      return res.status(400).json({ message: 'Email already exists try a different one.' });
    }

    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    Alternatively, you can follow this link to verify your account: https://www.partner.bazelink.co.ke/verificationautoagent?email=${newEmail}&code=${user.verificationCode}
    
    Best regards,
    Bazelink Support Team`;

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
    <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
      Welcome to Bazelink, ${user.username}!
    </h2>
    <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
      Thank you for registering with us! To complete your registration, please use the verification code below:
    </p>
    <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
      <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
        Verification Code: <span style="color: #1d4ed8;">${user.verificationCode}</span>
      </p>
    </div>
    <p style="text-align: center;">
      <a href="https://www.partner.bazelink.co.ke/verificationautoagent?email=${newEmail}&code=${user.verificationCode}" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
        Verify Your Account
      </a>
    </p>
    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
      If you did not request this, please disregard this email.
    </p>
    <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
      Best regards,<br> Bazelink Support Team
    </p>
  </div>
`;



    try {
      await sendEmail(newEmail, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        category: user.category,
        agentnumber: user.agentnumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    user.email = newEmail;
    await user.save();
    res.status(200).json({ message: 'Email updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Email' });
  }
};

// Controller function to add an order to the agent's packages
const addOrderToAgentPackages = async (req, res) => {
  try {
    const { agentnumber, orderId } = req.body;

    // Validate inputs
    if (!agentnumber || !orderId) {
      return res.status(400).json({ error: "Agent number and Order ID are required." });
    }

    // Find the order by orderNumber
    const order = await Order.findOne({ "items.pOrderNumbe": orderId });

    if (!order) {
      return res.status(400).json({ error: "Invalid Order." });
    }
    

    // Find the agent by agentnumber
    const agent = await User.findOne({ agentnumber });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    // Check if the order already exists in the agent's packages array
    const orderExists = agent.packeges.some(
      (package) => package.productId === orderId
    );
    if (orderExists) {
      return res
        .status(400)
        .json({ error: "Order already exists under this agent." });
    }else{
      const oldbal = agent.amount || 0;
      const newbal = oldbal + 20;
      agent.amount = newbal;
    }

    // Add the new order to the agent's packages
    agent.packeges.push({
      productId: orderId,
      processedDate: new Date(),
      ispacked: false,
    });

    // Update the order's properties
    await Order.updateOne(
      { "items.pOrderNumbe": orderId }, // Find the order with the matching pOrderNumbe
      { 
        $set: { "items.$.pCurrentPlace": `${agent.locations.town}, ${agent.locations.area}, ${agent.locations.specific}` } 
      }
    );
    order.currentplace = `${agent.locations.town}, ${agent.locations.area}, ${agent.locations.specific}`;    
    order.isDeliveryInProcess = true;

    // Save both documents
    await agent.save();
    await order.save();

    return res.status(200).json({
      message: "Order added successfully to agent packages.",
      agentnumber,
      orderId,
      currentplace: order.currentplace,
      isDeliveryInProcess: order.isDeliveryInProcess,
    });
  } catch (error) {
    console.error("Error adding order to agent packages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Handle withdrawal logic
const awithdraw = async (req, res) => {
  const { username, amount, Phonenumber } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ agentnumber: username });
    if (!user) {
      return res.status(404).json({ message: `User not found ${username}` });
    }

    // Check if the user has enough balance
    if (user.amount < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct the withdrawal amount from the user's balance
    const resp = await b2cRequestHandler(amount, Phonenumber);
    console.log(resp);
    
    user.amount -= amount;
    await user.save();

    // Record the withdrawal
    const withdrawal = new Withdrawal({
      username: user.agentnumber,
      phonenumber: Phonenumber,
      amount: amount,
      balance: user.amount,
    });
    await withdrawal.save();

    // Send success response
    res.status(200).json({ message: 'Withdrawal successful', balance: user.amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all withdrawals for a specific user
const agetWithdrawalsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const withdrawals = await Withdrawal.find({ agentnumber: username });
    if (!withdrawals.length) {
      return res.status(404).json({ message: 'No withdrawals found for this user' });
    }
    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  awithdraw,
  agetWithdrawalsByUsername,
  addOrderToAgentPackages,
  registerUser,
  login,
  verifyUser,
  updateEmail,
  resendVerificationCode,
  newrecoverPassword,
  resetPassword,
  changeusername,
  changepassword,
  changephonenumber,
  changeemail,
  logout,
};

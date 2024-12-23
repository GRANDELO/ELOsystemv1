const User = require('../models/DeliveryPersonnel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode, generateVerificationCode } = require('../services/verificationcode');
const sendEmail = require('../services/emailService');
require('dotenv').config();
const mongoose = require('mongoose');
const Box = require('../models/box'); // Adjust path as needed
const Withdrawal = require('../models/Withdrawal');
const {b2cRequestHandler} = require("./mpesaController");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phoneNumber, idnumber, username, dateOfBirth, gender, town, townspecific } = req.body;

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
    let user = await User.findOne({ $or: [{ email }, { phoneNumber } , { idnumber } ] });
    if (user) {
      return res.status(400).json({ message: 'Agent already exists' });
    }
    const agentnumber = 'DL' + generateVerificationCode(4);
    // Generate verification code and send email
    const alphanumericCode = generateAlphanumericVerificationCode(6);
    const subject = `Verification - ${alphanumericCode}`;
    const vermessage = `Dear ${firstName},

    Thank you for registering with Bazelink! as our agent Please use the following verification code to complete your registration:
    
    Your DPnumber is ${agentnumber},

    Verification Code: ${alphanumericCode}
    
    You can also follow this link to verify your account: https://baze-seller.web.app/deliveryVerification
    
    Best regards,
    Bazelink Support Team`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
          Welcome to Bazelink, ${firstName}!
        </h2>
        
        <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
          Your DPnumber is ${agentnumber},
        </p>
        <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
          Thank you for registering with us as our agent! To complete your registration, please use the verification code below:
        </p>
        <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
          <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
            Verification Code: <span style="color: #1d4ed8;">${alphanumericCode}</span>
          </p>
        </div>
        <p style="text-align: center;">
          <a href="https://baze-seller.web.app/deliveryVerification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
      vehicle_type: username,
      dateOfBirth: formattedDateOfBirth,
      gender,
      category: "Delivery Person",
      town,
      townspecificroute: townspecific,
      deliveryPersonnumber: agentnumber,
      verificationCode: alphanumericCode,
      isVerified: false,
      active: false,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      amount: 0,
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
    const user = await User.findOne({ $or: [{ email: username }, { deliveryPersonnumber: username } ] });
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
        username: user.deliveryPersonnumber,
        email: user.email,
        category: user.category,
        dpnumber: user.deliveryPersonnumber
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
      username: user.firstName,
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
    const vermessage = `Dear ${user.firstName},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    You can also follow this link to verify your account: https://baze-seller.web.app/deliveryVerification
    
    Best regards,
    Bazelink Support Team`;
    

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
    <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
      Welcome to Bazelink, ${user.firstName}!
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
      <a href="https://baze-seller.web.app/deliveryVerification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
      await sendEmail(user.email, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    try {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.deliveryPersonnumber,
          email: user.email,
          category: user.category,
          dpnumber: user.deliveryPersonnumber
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
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
    
    const vermessage = `Dear ${user.firstName},

    Thank you for joining Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    Alternatively, you can follow this link to verify your account: https://baze-seller.web.app/deliveryVerification
    
    If you did not sign up for this account, please disregard this email.
    
    Best regards,
    Bazelink Team`;
    
    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
        Welcome to Bazelink, ${user.firstName}!
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
        <a href="https://baze-seller.web.app/deliveryVerification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    const user = await User.findOne({ deliveryPersonnumber: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.passwordRecoveryToken = token;
    user.tokenExpiry = moment().add(1, 'hour').toDate();
    

    // Send the recovery email
    const subject = 'Password Reset Request';
    const message = `Dear ${user.firstName},

    We received a request to reset your password. To proceed, please use the token provided below:
    
    Password Reset Token: ${user.passwordRecoveryToken}
    
    Alternatively, you can reset your password by following this link: https://baze-seller.web.app/deliverypasswordreset
    
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
        <a href="https://baze-seller.web.app/deliverypasswordreset" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    const user = await User.findOne({ deliveryPersonnumber: username });

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
        username: user.deliveryPersonnumber,
        email: user.email,
        category: user.category,
        dpnumber: user.deliveryPersonnumber
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
      return res.status(404).json({ message: 'Phone Number is in use by a different delivery person' });
    }

    user.phoneNumber = newPhoneNumber;
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        username: user.deliveryPersonnumber,
        email: user.email,
        category: user.category,
        dpnumber: user.deliveryPersonnumber
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
    let checkuser = await User.findOne({ email:  newEmail });
    if (checkuser) {
      return res.status(400).json({ message: 'Email already exists try a different one.' });
    }

    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.firstName},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    Alternatively, you can follow this link to verify your account: https://baze-seller.web.app/deliveryVerification
    
    Best regards,
    Bazelink Support Team`;

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
    <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
      Welcome to Bazelink, ${user.firstName}!
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
      <a href="https://baze-seller.web.app/deliveryVerification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
      await sendEmail(lemail, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.deliveryPersonnumber,
        email: user.email,
        category: user.category,
        dpnumber: user.deliveryPersonnumber
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Email updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Email' });
  }
};

const assignBoxToDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonnumber, boxId } = req.body;

    // Find the delivery person
    const deliveryPerson = await User.findOne({ deliveryPersonnumber });
    if (!deliveryPerson) {
      return res.status(404).json({ success: false, message: 'Delivery person not found' });
    }
    

    // Find the box
    const box = await Box.findOne({ boxid: boxId });
    if (!box) {
      return res.status(404).json({ success: false, message: 'Box not found' });
    }

    // Validate box destination format
    if (!box.destination || !box.destination.includes(',')) {
      return res.status(400).json({ success: false, message: 'Invalid box destination format' });
    }

    // Split destination into town and route
    const [boxTown, boxSpecificRoute] = box.destination.split(',').map(part => part.trim().toLowerCase());

    // Validate delivery person town and route
    if (!deliveryPerson.town || !deliveryPerson.townspecificroute) {
      return res.status(400).json({ success: false, message: 'Delivery person town or route is not specified' });
    }

    // Check for destination mismatch
    if (deliveryPerson.town.trim().toLowerCase() !== boxTown || 
        deliveryPerson.townspecificroute.trim().toLowerCase() !== boxSpecificRoute) {
      return res.status(400).json({ success: false, message: 'Destination mismatch between delivery person and box' });
    }

    // Check if the box is already assigned
    if (box.deliveryPerson !== "non assigned") {
      return res.status(400).json({ success: false, message: `Box is already assigned to another delivery person.` });
    }

    // Check if box already exists in delivery person's packages
    const boxExists = deliveryPerson.packeges.some(pkg => pkg.boxid === boxId);
    if (boxExists) {
      return res.status(400).json({ success: false, message: 'Box is already assigned to this delivery person.' });
    }

    // Add box to delivery person's packages
    deliveryPerson.packeges.push({ 
      boxid: boxId,
      processedDate: new Date(),
      isdelivered: false,
    });
    await deliveryPerson.save();

    // Update box details
    box.packed = true;
    box.deliveryPerson = deliveryPersonnumber;
    box.isDeliveryInProcess = true;
    await box.save();

    return res.status(200).json({ success: true, message: 'Box successfully assigned to delivery person' });
  } catch (error) {
    console.error('Error assigning box to delivery person:', error);
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};


const getPackagesForDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonnumber } = req.params;

    // Find the delivery person by their deliveryPersonnumber
    const deliveryPerson = await User.findOne({ deliveryPersonnumber });

    if (!deliveryPerson) {
      return res.status(404).json({ success: false, message: 'Delivery person not found' });
    }

    // Get the packages assigned to the delivery person
    const packages = deliveryPerson.packeges;

    // Send the packages to the frontend
    return res.status(200).json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching packages for delivery person:', error);
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

// Handle withdrawal logic
const dpwithdraw = async (req, res) => {
  const { username, amount, Phonenumber } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ deliveryPersonnumber: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
      username: user.username,
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
const dpgetWithdrawalsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const withdrawals = await Withdrawal.find({deliveryPersonnumber: username });
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
  dpwithdraw,
  dpgetWithdrawalsByUsername,
  getPackagesForDeliveryPerson,
  assignBoxToDeliveryPerson,
  registerUser,
  login,
  verifyUser,
  updateEmail,
  resendVerificationCode,
  newrecoverPassword,
  resetPassword,
  changepassword,
  changephonenumber,
  changeemail,
  logout,
};

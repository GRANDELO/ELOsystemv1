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
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification code and send email
    const alphanumericCode = generateAlphanumericVerificationCode(6);
    const subject = `Verification - ${alphanumericCode}`;
    const vermessage = `Dear ${username},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${alphanumericCode}
    
    You can also follow this link to verify your account: https://bazelink.web.app/verification
    
    Best regards,
    Bazelink Support Team`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
          Welcome to Bazelink, ${username}!
        </h2>
        <p style="font-size: 16px; color: #555; text-align: center; margin-top: 0;">
          Thank you for registering with us! To complete your registration, please use the verification code below:
        </p>
        <div style="margin: 25px 0; padding: 20px; background-color: #f0f5fc; border: 1px dashed #1d4ed8; text-align: center; border-radius: 8px;">
          <p style="font-size: 20px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px;">
            Verification Code: <span style="color: #1d4ed8;">${alphanumericCode}</span>
          </p>
        </div>
        <p style="text-align: center;">
          <a href="https://bazelink.web.app/verification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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

    // Create new user with conditional amount field
    const formattedDateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');
    const userAmount = category === 'Seller' ? 0 : undefined;

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
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      amount: userAmount,
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req, res) => {

    /*
      try {
        const newFields = {
          active: false,
          amount: undefined, // default to undefined for non-Seller categories
        };
      
        // Prepare the update object with conditional defaults
        const updateFields = {};
        for (const [key, value] of Object.entries(newFields)) {
          updateFields[key] = { $ifNull: [`$${key}`, value] };
        }
      
        // Step 1: Update users without the 'active' field or 'amount' field
        await User.updateMany(
          {
            $or: Object.keys(newFields).map((key) => ({ [key]: { $exists: false } })),
          },
          { $set: newFields }
        );
      
        // Step 2: Specifically update 'Seller' users to set 'amount' to 0
        await User.updateMany(
          { category: 'Seller' },
          { $set: { amount: 0 } }
        );
      
        console.log('Missing fields added, and amount set for Seller users');
      } catch (error) {
        console.error('Error updating users:', error);
      }
    */

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
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    console.log(user.amount);
    res.json({ message: 'Login successful', token , category: user.category, username: user.username, amount: user.amount });
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

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    You can also follow this link to verify your account: https://bazelink.web.app/verification
    
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
      <a href="https://bazelink.web.app/verification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    try {
      const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
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
    
    Alternatively, you can follow this link to verify your account: https://grandelo.web.app/verification
    
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
        <a href="https://grandelo.web.app/verification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    
    Alternatively, you can reset your password by following this link: https://grandelo.web.app/reset-password
    
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
        <a href="https://grandelo.web.app/reset-password" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    let checkuser = await User.findOne({ newUsername });
    if (checkuser) {
      return res.status(400).json({ message: 'Username already exists try a different one.' });
    }
    user.username = newUsername;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
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
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
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

    user.phoneNumber = newPhoneNumber;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
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
    let checkuser = await User.findOne({ newEmail });
    if (checkuser) {
      return res.status(400).json({ message: 'Email already exists try a different one.' });
    }
    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

    Thank you for registering with Bazelink! Please use the following verification code to complete your registration:
    
    Verification Code: ${user.verificationCode}
    
    Alternatively, you can follow this link to verify your account: https://bazelink.web.app/verification
    
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
      <a href="https://bazelink.web.app/verification" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px; margin-top: 15px;">
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
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Email updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Email' });
  }
};
module.exports = {
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

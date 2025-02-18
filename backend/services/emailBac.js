const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a new transporter specifically for sending seller reminder emails
const sellerReminderTransporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,    // Use the same email service or a different one as needed
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Function to send seller reminder email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 * @returns {Promise} - Promise representing the success or failure of the email sending
 */
function sendSellerReminderEmail(to, subject, html) {
  const mailOptions = {
    from: `"BAZELINK" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,   // Only HTML version
  };

  return new Promise((resolve, reject) => {
    sellerReminderTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
}

module.exports = sendSellerReminderEmail;
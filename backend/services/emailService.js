const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Function to send a styled email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body for non-HTML email clients
 * @param {string} html - HTML body with inline styles for email clients
 * @returns {Promise} - Promise representing the success or failure of the email sending
 */
function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: `"BAZELINK" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text, // Optional plain text
    html: html, // HTML body for styling
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
}

module.exports = sendEmail;

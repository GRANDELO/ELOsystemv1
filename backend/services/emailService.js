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
 * Function to send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} html - HTML email body
 * @returns {Promise} - Promise representing the success or failure of the email sending
 */
function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: `"BAZELINK" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    //text: text,   // Plain text version
    html: html,   // HTML version
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

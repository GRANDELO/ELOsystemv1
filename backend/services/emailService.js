const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'grandeloltd1@gmail.com',
    pass: 'ondk pshm ecrb ffqy',
  },
});

/**
 * Function to send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 * @returns {Promise} - Promise representing the success or failure of the email sending
 */
function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'grandeloltd1@gmail.com',
    to: to,
    subject: subject,
    text: text,
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

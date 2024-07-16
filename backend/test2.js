const sendEmail = require('./services/emailService');

sendEmail('kinyi9461@gmail.com', 'Hello!', 'Grandelo say\'s Hi.')
  .then(info => {
    console.log('Email sent: ' + info.response);
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });

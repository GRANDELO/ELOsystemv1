const Resend = require('resend');

// Initialize with necessary configuration if needed
const resend = new Resend("re_88idDdYE_GLLeSnam7nMgXBtw99m7dn8o");

// Example usage of a function from the resend package
resend.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello!',
  body: 'This is a test email.'
})
.then(response => {
  console.log('Email sent successfully:', response);
})
.catch(error => {
  console.error('Error sending email:', error);
});

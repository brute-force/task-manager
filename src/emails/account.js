const sgMail = require('@sendgrid/mail');

const apiKey = process.env.API_KEY_SENDGRID;
sgMail.setApiKey(apiKey);

const sendEmailWelcome = (email, name) => {
  sgMail.send({
    from: 'reuel@panix.com',
    to: email,
    subject: `Welcome, ${name}!`,
    text: 'yes, hello.',
    html: '<b>yes, hello.</b>'
  });
};

const sendEmailCancellation = (email, name) => {
  sgMail.send({
    from: 'reuel@panix.com',
    to: email,
    subject: `BUH BYE, ${name}!`,
    text: 'bye.',
    html: '<b>yes, bye.</b>'
  });
};

module.exports = {
  sendEmailWelcome,
  sendEmailCancellation
};

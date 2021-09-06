const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const GOOGLE_CLIENT_ID = process.env.DEVELOPMENT ?
//   require('../credentials.json').GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID;

// const GOOGLE_CLIENT_SECRET = process.env.DEVELOPMENT ?
//   require('../credentials.json').GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET;

// const GOOGLE_REFRESH_TOKEN = process.env.DEVELOPMENT ?
//   require('../credentials.json').GOOGLE_REFRESH_TOKEN : process.env.GOOGLE_REFRESH_TOKEN;

// const OAuth2 = google.auth.OAuth2;
// const clientId = GOOGLE_CLIENT_ID;
// const clientSecret = GOOGLE_CLIENT_SECRET;
// const refreshToken = GOOGLE_REFRESH_TOKEN;

// const redirectUri = 'https://developers.google.com/oauthplayground';
// const accessType = 'offline'; /* https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient */

// const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri, accessType);

// oauth2Client.setCredentials({
//   refresh_token: refreshToken,
// });

/* Use OAuth2 */
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.NODEMAILER_AUTH_USERNAME,
//     clientId,
//     clientSecret,
//     refreshToken,
//   },
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_AUTH_USERNAME,
    pass: process.env.NODEMAILER_AUTH_PASSWORD,
  },
});

const sendEmail = (address, subject, body, callback) => {
  const mailOptions = {
    from: `"My Match Admin" <${process.env.NODEMAILER_AUTH_USERNAME}>`, /* To prevent emails from going to spam */
    to: address,
    subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err);
    } else {
      return callback();
    }
  });
};

module.exports = sendEmail;

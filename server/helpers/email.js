const nodemailer = require('nodemailer');
const { returnServerError } = require('../utils');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_AUTH_USERNAME,
    pass: process.env.NODEMAILER_AUTH_PASSWORD,
  },
});

const sendEmail = async ({ emailAddress, subject, emailBody }) => {
  const mailOptions = {
    /* To prevent emails from going to spam */
    from: `"Zawajina Admin" <${process.env.NODEMAILER_AUTH_USERNAME}>`,
    to: emailAddress,
    subject,
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: 201 };
  } catch (error) {
    returnServerError(res, error);
  }
};

module.exports = { sendEmail };

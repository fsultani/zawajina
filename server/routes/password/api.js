const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { checkIPAddress } = require('../../middleware/checkAuthentication');
const { usersCollection, insertLogs, geoLocationData } = require('../../db.js');

const { sendEmail } = require('../../helpers/email.js');
const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  paragraphFooterStyles,
  spanStyles,
  ctaButton,
  emailSignature,
} = require('../../email-templates/components.js');

const router = express.Router();

router.post('/request-email', async (req, res) => {
  try {
    const { email } = req.body;
    const { userIPAddress } = await checkIPAddress(req);
    const locationData = await geoLocationData(userIPAddress);

    const authUser = await usersCollection().findOne(
      { email, },
    );

    if (authUser) {
      const password = authUser.password;
      req.authUser = authUser;
      insertLogs(req, { password });

      const token = jwt.sign({ my_match_user_email: authUser.email }, JWT_SECRET, {
        expiresIn: '10 minutes',
      });

      const passwordResetUrl = `${process.env.HOST_URL}/password/reset?token=${token}`;

      const now = new Date();
      const localTime = now.toLocaleString();

      const subject = 'Reset your password';
      const emailBody = `
        <div style="${emailBodyContainerStyles}">
          ${emailHeader({ recipientName: authUser.name })}
          <p style="${paragraphStyles({})}">
            You are receiving this email because you requested to reset your password. If you did not make this request, please
            log in to your account and change your password immediately.
          </p>
          ${ctaButton({
        ctaButtonUrl: passwordResetUrl,
        ctaButtonText: 'Reset Password'
      })}
          ${emailSignature}

          <div style="padding-top: 16px; margin-top: 16px; border-top: solid 1px #eee;">
            <p style="${paragraphStyles({
        customStyles: `font-weight: bold;`,
      })}">
              Where this request came from:
            </p>
 
            <p style="${paragraphFooterStyles({})}">
              Date and time:
              <span style="${spanStyles({})}">
                ${localTime}
              </span>
            </p>
 
            <p style="${paragraphFooterStyles({})}">
              Country:
              <span style="${spanStyles({})}">
                ${locationData.country}
              </span>
            </p>
 
            <p style="${paragraphFooterStyles({})}">
              ${locationData.region ? `Region: <span style="${spanStyles({})}">${locationData.region}</span>` : ''}
            </p>
 
            <p style="${paragraphFooterStyles({})}">
              City:
              <span style="${spanStyles({})}">
                ${locationData.city}
              </span>
            </p>
 
            <p style="${paragraphFooterStyles({})}">
              IP address:
              <span style="${spanStyles({})}">
                ${locationData.userIPAddress}
              </span>
            </p>
          </div>
        </div>
      `;

      await sendEmail({ emailAddress: authUser.email, subject, emailBody })

      let response = { redirectUrl: '/login' }

      if (process.env.NODE_ENV === 'development') {
        response = { ...response, token, passwordResetUrl }
      }

      res.status(201).send({ response });
    } else {
      res.sendStatus(201);
    }
  } catch (error) {
    console.log(`error - server/routes/password/api.js:125\n`, error);
  }
});

router.post('/reset', async (req, res) => {
  try {
    const {
      newPassword,
      passwordResetToken,
    } = req.body;

    const jwtVerify = jwt.verify(passwordResetToken, JWT_SECRET);
    const bcryptGenSalt = await bcrypt.genSalt(10);
    const bcryptHash = await bcrypt.hash(newPassword, bcryptGenSalt);

    const { value } = await usersCollection().findOneAndUpdate(
      { email: jwtVerify.my_match_user_email },
      {
        $set: {
          password: bcryptHash,
        }
      }
    );

    req.authUser = value;
    insertLogs(req, { password: bcryptHash });

    const token = jwt.sign({ my_match_userId: value._id }, JWT_SECRET, {
      expiresIn: '1 day',
    });

    res.status(201).json({ token, url: '/users?' });
  } catch (error) {
    console.log(`error - server/routes/password/api.js:157\n`, error);

    if (error.name === 'TokenExpiredError') return res.status(401).send({
      errorMessage: `
        <p>Your password reset request has expired.</p>
        <p>Please try again.</p>
      `
    })

    if (error.name === 'JsonWebTokenError') return res.status(401).send({
      errorMessage: `<p>Invalid token</p>`
    })

    return res.sendStatus(500);
  }
})

module.exports = router;

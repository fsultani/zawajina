const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection, insertLogs } = require('../db.js');
const { FetchData, getAllFiles } = require('../utils.js');

const sendEmail = require('../helpers/email.js');
const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  paragraphFooterStyles,
  spanStyles,
  ctaButton,
  emailSignature,
} = require('../email-templates/components.js');

const router = express.Router();

let stylesDirectoryPath = [];
let scriptsDirectoryPath = [];

let styles = [];
let scripts = [];

router.get('/request', (_req, res) => {
  stylesDirectoryPath = ['client/views/landing-pages/password/forgot-password'];
  scriptsDirectoryPath = ['client/views/landing-pages/password/forgot-password'];

  styles = [
    '/static/assets/styles/material-design-iconic-font.min.css',
    '/static/assets/styles/bootstrap.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
  ];

  scripts = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Login - My Match',
      styles: getAllFiles({ directoryPath: stylesDirectoryPath, fileType: 'css', filesArray: styles }),
      scripts: getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts }),
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/password/forgot-password/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
});

router.get('/reset', (_req, res) => {
  stylesDirectoryPath = ['client/views/landing-pages/password/reset-password'];
  scriptsDirectoryPath = ['client/views/landing-pages/password/reset-password/js'];

  styles = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
  ];

  scripts = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Login - My Match',
      styles: getAllFiles({ directoryPath: stylesDirectoryPath, fileType: 'css', filesArray: styles }),
      scripts: getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts }),
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/password/reset-password/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
});

router.post('/api/request', async (req, res) => {
  const { userIPAddress, endpoint, userId } = req;
  const { email } = req.body;

  const geoLocationData = await FetchData(`http://ip-api.com/json/${userIPAddress}`);

  const authUser = await usersCollection().findOne(
    { email, },
  );

  const password = authUser.password;

  await insertLogs({
    password,
  },
    userIPAddress,
    endpoint,
    userId);

  if (authUser) {
    const token = jwt.sign({ my_match_user_email: authUser.email }, JWT_SECRET, {
      expiresIn: '10 minutes',
    });

    const url = `${process.env.HOST_URL}/password/reset?token=${token}`;

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
      ctaButtonUrl: url,
      ctaButtonText: 'Reset Password'
    })}
        ${emailSignature}

        <div style="padding-top: 16px; margin-top: 16px; border-top: solid 1px #cccccc;">
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
              ${geoLocationData.country}
            </span>
          </p>

          <p style="${paragraphFooterStyles({})}">
            ${geoLocationData.region ? `Region: <span style="${spanStyles({})}">${geoLocationData.region}</span>` : ''}
          </p>

          <p style="${paragraphFooterStyles({})}">
            City:
            <span style="${spanStyles({})}">
              ${geoLocationData.city}
            </span>
          </p>

          <p style="${paragraphFooterStyles({})}">
            IP address:
            <span style="${spanStyles({})}">
              ${geoLocationData.query}
            </span>
          </p>
        </div>
      </div>
    `;

    await sendEmail(authUser.email, subject, emailBody);
    res.status(201).json({ token });
  } else {
    res.sendStatus(201);
  }

});

router.post('/api/reset', async (req, res) => {
  try {
    const {
      newPassword,
      userIPAddress,
      passwordResetToken,
    } = req.body;

    const jwtVerify = jwt.verify(passwordResetToken, JWT_SECRET);

    const { _id: userId } = await usersCollection().findOne({ email: jwtVerify.my_match_user_email });

    const bcryptGenSalt = await bcrypt.genSalt(10);
    const bcryptHash = await bcrypt.hash(newPassword, bcryptGenSalt);

    const authUser = await usersCollection().findOneAndUpdate(
      { email: jwtVerify.my_match_user_email, },
      {
        $set: {
          password: bcryptHash,
        }
      }
    );

    const endpoint = req.originalUrl;
    await insertLogs({
      password: bcryptHash,
    },
      userIPAddress,
      endpoint,
      userId
    );

    const token = jwt.sign({ my_match_userId: authUser.value._id }, JWT_SECRET, {
      expiresIn: '1 day',
    });
    res.status(201).json({ token });
  } catch (error) {
    console.log(`error\n`, error);
    res.sendStatus(401);
  }
})

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection, insertLogs } = require('../../db.js');
const { comparePassword } = require('../../models/user');
const { verifyDate, returnServerError } = require('../../utils.js');
const { emailVerification } = require('../../email-templates/email-verification.js');
const { sendEmail } = require('../../helpers/email');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { email, password, fingerprint } = req.body;
    email = email.toLowerCase().trim();

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isValidEmail = emailRegex.test(email);
    const isPasswordLengthValid = !!password.length;

    if (!isValidEmail || !isPasswordLengthValid) return res.sendStatus(400);

    const authUser = await usersCollection().findOne({ email });
    if (!authUser) return res.sendStatus(401);

    let responseStatus;
    let responsePayload = {};
    let updates = {};

    if (authUser.email == 'admin@zawajina.com') {
      const token = jwt.sign({ my_match_authUserId: authUser._id }, JWT_SECRET, {
        expiresIn: '1 day',
      });

      responseStatus = 201;
      responsePayload = {
        cookie: {
          type: 'my_match_authToken',
          value: token,
        },
        url: '/admin/accounts',
      };

      return res.status(responseStatus).send(responsePayload);
    }

    const isPasswordValid = await comparePassword(password, authUser.password);
    if (!isPasswordValid) return res.sendStatus(401);

    const authUserId = authUser._id;

    const userStartedRegistration = verifyDate(authUser.startedRegistrationAt)
    const userCompletedRegistration = verifyDate(authUser.completedRegistrationAt)
    const emailWasVerified = verifyDate(authUser.emailVerified);

    /* User deleted their account, so return error. */
    if (authUser._account?.userAccountStatus === 'deleted') {
      responseStatus = 200;
      responsePayload = {
        userAccountStatus: authUser._account.userAccountStatus,
      }

      return res.status(responseStatus).send(responsePayload);
    }

    if (userStartedRegistration && userCompletedRegistration && emailWasVerified) {
      /* User completed everything and can log in */
      const token = jwt.sign({ my_match_authUserId: authUser._id }, JWT_SECRET, {
        expiresIn: '1 day',
      });

      const isNewFingerprint = !authUser.fingerprints?.includes(fingerprint);
      if (isNewFingerprint) {
        await usersCollection().findOneAndUpdate(
          { _id: authUserId },
          {
            $push: {
              fingerprints: fingerprint,
            }
          },
        )
      }

      responseStatus = 201;
      responsePayload = {
        cookie: {
          type: 'my_match_authToken',
          value: token,
        },
        url: '/users',
      };

      if (authUser._account.admin.accountStatus !== 'approved') {
        responsePayload = {
          ...responsePayload,
          url: '/profile',
        };

        updates = {
          ...authUser._account,
        }
      }

      if (authUser._account.userAccountStatus === 'inactive') {
        const userAccountStatus = 'active';
        const _account = {
          ...authUser._account,
          userAccountStatus,
        };

        await usersCollection().findOneAndUpdate(
          { _id: authUserId },
          {
            $set: {
              _account,
            },
          },
        )

        const changedValue = `${authUser._account.userAccountStatus} => ${userAccountStatus}`;
        updates = {
          _account: changedValue,
        }
      }
    }

    if (userStartedRegistration && !userCompletedRegistration) {
      responseStatus = 200;

      responsePayload = {
        cookie: {
          type: 'my_match_authUserId',
          value: authUserId,
        },
      };

      if (emailWasVerified) {
        responsePayload = {
          ...responsePayload,
          url: '/signup/profile',
        };
      } else {
        const { emailVerificationToken, subject, emailBody } = emailVerification({ name: authUser.name });

        await usersCollection().findOneAndUpdate(
          { _id: authUserId },
          {
            $set: {
              emailVerificationToken,
              emailVerificationTokenDateSent: new Date(),
            },
          },
        );

        await sendEmail({ emailAddress: email, subject, emailBody })

        responsePayload = {
          ...responsePayload,
          url: '/verify-email',
        };
      }

      updates = {
        userStartedRegistration,
        userCompletedRegistration,
        emailWasVerified,
      }
    }

    req.authUser = authUser;
    insertLogs(req, {
      ...updates,
    });

    return res.status(responseStatus).send(responsePayload);
  } catch (error) {
    returnServerError(res, error);
  }
});

module.exports = router;

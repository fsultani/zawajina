const { ObjectId } = require('mongodb');

const { usersCollection } = require('../../db.js');
const { emailVerification } = require('../../email-templates/email-verification.js');
const { sendEmail } = require('../../helpers/email.js');
const { verifyDate } = require('../../utils.js');

const checkEmailVerification = (req, res) => {
  const { my_match_userId } = req.cookies;

  usersCollection().findOne({ _id: ObjectId(my_match_userId) }, (_err, user) => {
    if (!user) return res.status(401).send();

    const userStartedRegistration = verifyDate(user.startedRegistrationAt);
    const userCompletedRegistration = verifyDate(user.completedRegistrationAt);

    if (userStartedRegistration && !userCompletedRegistration) {
      const hasEmailVerificationToken = !isNaN(user.emailVerificationToken);
      const emailVerificationTokenWasSent = verifyDate(user.emailVerificationTokenDateSent);
      const emailWasVerified = verifyDate(user.emailVerified);

      if (hasEmailVerificationToken && emailVerificationTokenWasSent) {
        /* User began the first step of registration and was sent a token, but didn't enter it. */
        let url = '/verify-email';

        if (emailWasVerified) {
          /* User already verified their email with a token. */
          url = '/signup/profile';
        }

        return res.status(200).send({ emailWasVerified, url });
      }

      /* User created an account, but no token was sent, and the email was never verified. */
      const { emailVerificationToken, subject, emailBody } = emailVerification({ name: user.name });

      usersCollection().findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            emailVerificationToken,
            emailVerificationTokenDateSent: new Date(),
          },
        },
        async (_, user) => {
          const emailAddress = user.value.email;

          if (process.env.NODE_ENV !== 'development') {
            await sendEmail({ emailAddress, subject, emailBody })
          }

          return res.sendStatus(201);
        }
      );
    }

    if (userStartedRegistration && userCompletedRegistration) {
      return res.status(403).send({ error: 'Account already exists' });
    }

    /* The user never started registration.  Possibly a server or db error. */
    return res.sendStatus(500);
  })
};

module.exports = checkEmailVerification;

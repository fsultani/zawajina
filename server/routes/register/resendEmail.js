const { usersCollection } = require('../../db.js');
const { emailVerification } = require('../../email-templates/email-verification.js');
const { sendEmail } = require('../../helpers/email.js');
const { returnServerError } = require('../../utils.js');

const resendEmail = (req, res) => {
  try {
    const email = req.body.email.trim();

    usersCollection().findOne({ email }, (_err, userAccount) => {
      /* For security, redirect the user to the '/verify-email' route even if the account doesn't exist. */
      if (!userAccount) return res.status(201).send({ url: '/verify-email' });

      if (userAccount?.startedRegistrationAt && userAccount?.completedRegistrationAt) {
        return res.status(403).send({ message: 'Account already exists' });
      }

      if (userAccount?.startedRegistrationAt && !userAccount?.completedRegistrationAt) {
        const { emailVerificationToken, subject, emailBody } = emailVerification({ name: userAccount.name });

        usersCollection().findOneAndUpdate(
          { _id: userAccount._id },
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

            return res.status(201).send({ url: '/verify-email' });
          }
        );
      }
    })
  } catch (error) {
    returnServerError(error)
  }
};

module.exports = { resendEmail };

const { ObjectId } = require('mongodb');

const { usersCollection } = require('../../db.js');
const emailVerification = require('../../email-templates/email-verification.js');
const sendEmail = require('../../helpers/email.js');

const resendEmail = (req, res) => {
  const { my_match_userId } = req.cookies;
  const { email } = req.body;

  usersCollection().findOne({ _id: ObjectId(my_match_userId) }, (err, user) => {
    usersCollection().findOne({ email }, (err, accountExists) => {
      if (err) {
        return res.status(500).send();
      }

      if (accountExists && accountExists.startedRegistrationAt && accountExists.completedRegistrationAt) {
        return res.status(403).json({ error: 'Account already exists' });
      }

      if (user.startedRegistrationAt && !user.completedRegistrationAt) {
        const { emailVerificationToken, subject, emailBody } = emailVerification({ name: user.name });

          usersCollection().updateOne(
            { _id: user._id },
            {
              $set: {
                email,
                emailVerificationToken,
                emailVerificationTokenDateSent: new Date(),
              },
            },
            async (err, user) => {
              if (err) {
                return res.json({ error: 'Unknown error' });
              } else {
                await sendEmail(email, subject, emailBody)
                return res.status(201).send();
              }
            }
          );
      } else {
        /* The user never started registration.  Possibly a server or db error. */
        return res.status(500).send();
      }
    })
  })
};

module.exports = resendEmail;

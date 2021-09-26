const { ObjectId } = require('mongodb');
const { usersCollection } = require('../../db.js');
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
          const emailVerificationToken = Math.floor(Math.random() * 90000) + 10000;
          const subject = 'Thanks for signing up on My Match!';
          const emailBody = `
            <p>As-salāmu ʿalaykum, ${user.name}.  Thanks for signing up!</p>
            <p>Please enter the following code to verify your email address: ${emailVerificationToken}</p>
          `;

          usersCollection().updateOne(
            { _id: user._id },
            {
              $set: {
                email,
                emailVerificationToken,
                emailVerificationTokenDateSent: new Date(),
              },
            },
            (err, user) => {
              if (err) {
                return res.json({ error: 'Unknown error' });
              } else {
                sendEmail(email, subject, emailBody, () => {
                  return res.status(201).send();
                });
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

const { ObjectId } = require('mongodb');
const { usersCollection } = require('../../db.js');

const sendVerificationEmail = (req, res) => {
  const { my_match_userId } = req.cookies;

  usersCollection().findOne({ _id: ObjectId(my_match_userId) }, (err, user) => {
    if (!user) return res.status(401).send();
    if (user.startedRegistrationAt && !user.completedRegistrationAt) {
      if (user.emailVerificationToken && !user.emailVerified) {
        /* User began completed the first step of registration and was sent a token, but did not enter it. */
        return res.status(200).json({ message: 'Token Sent' })
      } else if (user.emailVerificationToken && user.emailVerified) {
        /* User already verified their email with a token. */
        return res.status(200).json({ message: 'Email verified' })
      } else {
        /* User created an account, but no token was sent and the email was never verified. */
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
      }
    } else if (user.startedRegistrationAt && user.completedRegistrationAt) {
      return res.status(403).json({ error: 'Account already exists' });
    }
    else {
      /* The user never started registration.  Possibly a server or db error. */
      return res.status(500).send();
    }
  })
};

module.exports = sendVerificationEmail;

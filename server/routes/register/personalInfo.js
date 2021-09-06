const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const { usersCollection } = require('../../db.js');
const sendEmail = require('../../helpers/email.js');

const personalInfo = (req, res) => {
  let { nameValue, email, password } = req.body;
  const getErrors = validationResult(req);
  const name = nameValue
    .split(',')
    .map(group =>
      group
        .replace('_', ' ')
        .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    )
    .join(', ');

  if (!getErrors.isEmpty()) {
    return res.status(400).json({ error: getErrors.array() });
  } else {
    usersCollection().findOne({ email }, (err, userExists) => {
      if (!userExists) {
        /* User does not exist; create a new account */
        const emailVerificationToken = Math.floor(Math.random() * 90000) + 10000;
        const subject = 'Thanks for signing up on My Match!';
        const emailBody = `
          <p>As-salāmu ʿalaykum, ${name}.  Thanks for signing up!</p>
          <p>Please enter the following code to verify your email address: ${emailVerificationToken}</p>
        `;
        console.log(`emailVerificationToken\n`, emailVerificationToken);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            password = hash;
            const newUser = {
              name,
              email,
              password,
              startedRegistrationAt: new Date(),
              completedRegistrationAt: false,
              emailVerified: false,
              emailVerificationToken,
              emailVerificationTokenDateSent: new Date(),
            };
            usersCollection().insertOne(newUser, (err, user) => {
              if (err) throw Error(err);
              const userId = user.insertedId;
              sendEmail(email, subject, emailBody, () => {
                return res.status(201).json({
                  userId,
                  emailVerified: false,
                });
              });
            });
          });
        });
      } else if (userExists.startedRegistrationAt && !userExists.completedRegistrationAt) {
        /* User completed step 1 only */
        if (userExists.emailVerificationToken && !userExists.emailVerified) {
          /* User completed step 1 only and was sent a token, but did not enter it. */
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              password = hash;
              usersCollection().findOneAndUpdate(
                { _id: userExists._id },
                {
                  $set: {
                    name,
                    password,
                  },
                },
                (err, user) => {
                  if (err) {
                    return res.json({ error: 'Unknown error' });
                  } else {
                    res.status(201).json({
                      userId: userExists._id,
                      emailVerified: false,
                    });
                  }
                }
              );
            });
          });
        } else if (userExists.emailVerificationToken && userExists.emailVerified) {
          /* User completed step 1 and verified their email with a token. */
          return res.status(200).send();
        } else {
          /*
            User created an account, but no token was sent and the email was never verified.
            Possibly a server or db error.
          */
          return res.status(500).send();
        }
      } else if (userExists.startedRegistrationAt && userExists.completedRegistrationAt) {
        /* Email address already exists */
        return res.status(403).json({ error: 'Account already exists' });
      } else {
        /* The user never started registration.  Possibly a server or db error. */
        return res.status(500).send();
      }
    });
  }
};

module.exports = personalInfo;

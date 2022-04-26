const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const { usersCollection } = require('../../db.js');
const sendEmail = require('../../helpers/email.js');
const { FetchData } = require('../../utils.js');
const emailVerification = require('../../email-templates/email-verification.js');

const personalInfo = (req, res) => {
  const { nameValue, email, userIPAddress } = req.body;
  let { password } = req.body;
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
    usersCollection().findOne({ email }, async (err, userExists) => {
      if (!userExists) {

        try {
          /* User does not exist; create a new account */
          const geoLocationData = await FetchData(`http://ip-api.com/json/${userIPAddress}`);
          const latitude = geoLocationData.lat;
          const longitude = geoLocationData.lon;

          const { emailVerificationToken, subject, emailBody } = emailVerification({ name });
          console.log(`emailVerificationToken\n`, emailVerificationToken);

          const bcryptHash = await bcrypt.hash(password, 10);
          password = bcryptHash;
          const newUser = {
            name,
            email,
            password,
            loginData: [{
              time: new Date(),
              geoLocationData,
            }],
            location: { type: "Point", coordinates: [longitude, latitude] },
            startedRegistrationAt: new Date(),
            completedRegistrationAt: false,
            emailVerified: false,
            emailVerificationToken,
            emailVerificationTokenDateSent: new Date(),
          };

          const insertUser = await usersCollection().insertOne(newUser);
          const userId = insertUser.insertedId;

          if (process.env.NODE_ENV !== 'localhost') {
            await sendEmail(email, subject, emailBody);
          }

          return res.status(201).json({
            userId,
            emailVerified: false,
            emailVerificationToken: process.env.NODE_ENV === 'localhost' ? emailVerificationToken : null,
          });
        } catch (error) {
          if (process.env.DEVELOPMENT) {
            throw Error(`Error in personalInfo: ${error}`)
          }
        }
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
          return res.status(200).json({
            userId: userExists._id,
          });
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

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '362053896944-4jqtj3ksnjs56f9vrdgnoc4kdhvgiqj4.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const { usersCollection, insertLogs } = require('../../db.js');
const { emailVerification } = require('../../email-templates/email-verification.js');
const { sendEmail } = require('../../helpers/email');
const {
  inputHasSocialMediaAccount,
  inputHasSocialMediaTag,
  inputHasPhoneNumber,
  preventWebLinks,
  returnServerError,
  verifyDate,
} = require('../../utils.js');

const googleAuth = async (req, res) => {
  const { encodedIDToken } = req.body;
  const userIPAddress = req.headers.useripaddress;

  const ticket = await client.verifyIdToken({
    idToken: encodedIDToken,
    audience: CLIENT_ID, 
  });
  const { name, email, email_verified } = ticket.getPayload();
  console.log(`email - server/routes/register/googleAuth.js:28\n`, email);
  // const payload = ticket.getPayload();

  usersCollection().findOne({ email }, async (err, userExists) => {
    try {
      let endpoint = req.originalUrl;

      if (!err && !userExists) {
        /* User does not exist; create a new account */
        // const bcryptGenSalt = await bcrypt.genSalt(10);
        // const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
        // password = bcryptHash;

        // const { emailVerificationToken, subject, emailBody } = emailVerification({ name });

        const newUserData = {
          name,
          email,
          password: 'Verified by Google',
        }

        const newUser = {
          ...newUserData,
          emailVerificationToken: 'Verified by Google',
          emailVerificationTokenDateSent: new Date(),
          emailVerified: new Date(),
          startedRegistrationAt: new Date(),
          completedRegistrationAt: false,
        };

        const insertUser = await usersCollection().insertOne(newUser);
        const userId = insertUser.insertedId;

        // if (process.env.NODE_ENV !== 'development') {
        //   await sendEmail({ emailAddress: email, subject, emailBody })
        // }

        console.log(`newUser - server/routes/register/googleAuth.js:64\n`, newUser);

        await insertLogs(newUser, userIPAddress, endpoint);

        let payload = {
          userId,
          url: '/signup/profile',
        }

        // if (process.env.NODE_ENV === 'development') {
        //   /** Using emailVerificationToken for creating test user accounts in server/queries/apiCalls/create-user-accounts.js */
        //   payload = {
        //     ...payload,
        //     emailVerificationToken,
        //   }
        // }

        return res.status(201).send({
          ...payload,
        });
      }

      const userStartedRegistration = verifyDate(userExists.startedRegistrationAt);
      const userCompletedRegistration = verifyDate(userExists.completedRegistrationAt);

      if (userStartedRegistration && !userCompletedRegistration) {
        /* User completed step 1; allow the user to proceed to step 2 */
        endpoint += ' - startedRegistrationAt && !completedRegistrationAt';

        const userId = userExists._id;
        const emailVerifiedDate = Date.parse(userExists.emailVerified)
        const emailVerified = !isNaN(emailVerifiedDate)

        const isNewPassword = !await bcrypt.compare(password, userExists.password)
        const isNewName = userExists.name !== name

        if (isNewName && isNewPassword) {
          const changedValue = `${userExists.name} => ${name}`;

          const bcryptGenSalt = await bcrypt.genSalt(10);
          const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
          password = bcryptHash;

          await usersCollection().findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                name,
                password,
              },
            },
          );

          await insertLogs({
            name: changedValue,
            password,
          },
            userIPAddress,
            endpoint,
            userId
          );
        }

        if (isNewName && !isNewPassword) {
          await usersCollection().findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                name,
              },
            },
          );

          const changedValue = `${userExists.name} => ${name}`;
          await insertLogs({
            name: changedValue,
          },
            userIPAddress,
            endpoint,
            userId
          );
        }

        if (!isNewName && isNewPassword) {
          const bcryptGenSalt = await bcrypt.genSalt(10);
          const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
          password = bcryptHash;

          await usersCollection().findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                password,
              },
            },
          );

          await insertLogs({
            password,
          },
            userIPAddress,
            endpoint,
            userId
          );
        }

        if (!isNewName && !isNewPassword) {
          await usersCollection().findOne({ _id: userId });

          await insertLogs({},
            userIPAddress,
            endpoint,
            userId
          );
        }

        let url = '/verify-email';
        if (emailVerified) {
          url = '/signup/profile';
        }

        return res.status(201).send({
          userId,
          url,
        });
      }

      if (userStartedRegistration && userCompletedRegistration) {
        /* Email address already exists */
        return res.status(403).send({ message: 'Account already exists' });
      } else {
        /* The user never started registration.  Possibly a server or db error. */
        return res.sendStatus(500);
      }
    } catch (error) {
      returnServerError(res, error);
    }
  });
};

module.exports = googleAuth;

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

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

const personalInfo = async (req, res) => {
  const { nameValue, email, fingerprint } = req.body;
  let { password } = req.body;

  const getErrors = validationResult(req);
  const name = nameValue
    .split(',')
    .map(group =>
      group
        .replace('_', ' ')
        .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    )
    .join(', ')
    .trim();

  if (!getErrors.isEmpty()) return res.status(400).json({ error: getErrors.array() });

  const invalidCharactersRegex = /[!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/;
  const invalidCharacters = string => invalidCharactersRegex.test(string);

  const numbersRegex = /\d/;
  const inputHasAtLeastOneNumber = string => numbersRegex.test(string);

  const invalidInput = string => (
    !string ||
    inputHasSocialMediaAccount(string) ||
    inputHasSocialMediaTag(string) ||
    inputHasPhoneNumber(string) ||
    invalidCharacters(name) ||
    inputHasAtLeastOneNumber(name) ||
    preventWebLinks(string)
  )

  let message = '';
  if (name.length === 0) {
    message = 'Name cannot be blank';
  } else if (inputHasSocialMediaAccount(name) || inputHasSocialMediaTag(name)) {
    message = 'No email or social media accounts allowed';
  } else if (inputHasPhoneNumber(name)) {
    message = 'Phone numbers are not allowed';
  } else if (invalidCharacters(name)) {
    message = 'Name cannot contain special characters';
  } else if (inputHasAtLeastOneNumber(name)) {
    message = 'Name cannot contain a number';
  } else if (preventWebLinks(name)) {
    message = 'Web links are not allowed';
  }

  if (invalidInput(name)) return res.status(400).send({ querySelector: 'name', message });

  usersCollection().findOne({
    $or: [
      {
        email,
      },
      {
        fingerprints: {
          $in: process.env.NODE_ENV === 'development' ? [] : [fingerprint],
        }
      },
    ]
  }, async (err, authUser) => {
    try {
      if (!err && !authUser) {
        /* User does not exist; create a new account */
        const bcryptGenSalt = await bcrypt.genSalt(10);
        const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
        password = bcryptHash;

        const { emailVerificationToken, subject, emailBody } = emailVerification({ name });

        let newUserData = {
          name,
          email,
          password,
        }

        const newUser = {
          ...newUserData,
          emailVerificationToken,
          emailVerificationTokenDateSent: new Date(),
          startedRegistrationAt: new Date(),
          completedRegistrationAt: false,
          fingerprints: [fingerprint],
        };

        const insertUser = await usersCollection().insertOne(newUser);
        const authUserId = insertUser.insertedId;
        newUserData = {
          ...newUserData,
          _id: authUserId,
        }

        req.authUser = newUserData;

        if (process.env.NODE_ENV !== 'development') {
          await sendEmail({ emailAddress: email, subject, emailBody })
        }

        insertLogs(req, newUser);

        let payload = {
          authUserId,
          url: '/verify-email',
        }

        if (process.env.NODE_ENV === 'development') {
          /** Using emailVerificationToken for creating test user accounts in server/queries/apiCalls/create-user-accounts.js */
          payload = {
            ...payload,
            emailVerificationToken,
          }
        }

        return res.status(201).send({
          ...payload,
        });
      }

      const userStartedRegistration = verifyDate(authUser.startedRegistrationAt);
      const userCompletedRegistration = verifyDate(authUser.completedRegistrationAt);

      if (userStartedRegistration && !userCompletedRegistration) {
        /* User completed step 1; allow the user to proceed to step 2 */
        req.originalUrl += ' - startedRegistrationAt && !completedRegistrationAt';

        req.authUser = authUser;
        const authUserId = authUser._id;
        const emailVerifiedDate = Date.parse(authUser.emailVerified)
        const emailVerified = !isNaN(emailVerifiedDate)

        const isNewPassword = !await bcrypt.compare(password, authUser.password)
        const isNewName = authUser.name !== name

        if (isNewName && isNewPassword) {
          const changedValue = `${authUser.name} => ${name}`;

          const bcryptGenSalt = await bcrypt.genSalt(10);
          const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
          password = bcryptHash;

          await usersCollection().findOneAndUpdate(
            { _id: authUserId },
            {
              $set: {
                name,
                password,
              },
            },
          );

          insertLogs(req, {
            name: changedValue,
            password,
          });
        }

        if (isNewName && !isNewPassword) {
          await usersCollection().findOneAndUpdate(
            { _id: authUserId },
            {
              $set: {
                name,
              },
            },
          );

          const changedValue = `${authUser.name} => ${name}`;
          insertLogs(req, {
            name: changedValue,
          });
        }

        if (!isNewName && isNewPassword) {
          const bcryptGenSalt = await bcrypt.genSalt(10);
          const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
          password = bcryptHash;

          await usersCollection().findOneAndUpdate(
            { _id: authUserId },
            {
              $set: {
                password,
              },
            },
          );

          insertLogs(req, {
            password,
          });
        }

        if (!isNewName && !isNewPassword) {
          await usersCollection().findOne({ _id: authUserId });

          insertLogs(req, {});
        }

        let url = '/verify-email';
        if (emailVerified) {
          url = '/signup/profile';
        }

        return res.status(201).send({
          authUserId,
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

module.exports = personalInfo;

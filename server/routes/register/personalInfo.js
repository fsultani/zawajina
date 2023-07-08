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

const personalInfo = (req, res) => {
  const { nameValue, email } = req.body;
  const userIPAddress = req.headers.useripaddress;
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

  usersCollection().findOne({ email }, async (err, userExists) => {
    try {
      let endpoint = req.originalUrl;

      if (!err && !userExists) {
        /* User does not exist; create a new account */
        const bcryptGenSalt = await bcrypt.genSalt(10);
        const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
        password = bcryptHash;

        const { emailVerificationToken, subject, emailBody } = emailVerification({ name });

        const newUserData = {
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
        };

        const insertUser = await usersCollection().insertOne(newUser);
        const userId = insertUser.insertedId;

        if (process.env.NODE_ENV !== 'development') {
          await sendEmail({ emailAddress: email, subject, emailBody })
        }

        newUser._id = userId;
        await insertLogs(newUser, userIPAddress, endpoint);

        let payload = {
          userId,
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

module.exports = personalInfo;

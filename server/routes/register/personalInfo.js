const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const { usersCollection, insertLogs } = require('../../db.js');

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
      try {
        let endpoint = req.originalUrl;

        if (!err && !userExists) {
          /* User does not exist; create a new account */
          const bcryptGenSalt = await bcrypt.genSalt(10);
          const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
          password = bcryptHash;

          const newUserData = {
            name,
            email,
            password,
          }

          const newUser = {
            ...newUserData,
            startedRegistrationAt: new Date(),
            completedRegistrationAt: false,
          };

          const insertUser = await usersCollection().insertOne(newUser);
          const userId = insertUser.insertedId;

          await insertLogs(newUser, userIPAddress, endpoint);

          return res.status(201).json({
            userId,
          });
        } else if (userExists.startedRegistrationAt && !userExists.completedRegistrationAt) {
          /* User completed step 1; allow the user to proceed to step 2 */
          endpoint += ' | startedRegistrationAt && !completedRegistrationAt';

          const userId = userExists._id;

          let response = await usersCollection().findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                name,
              },
            },
          );

          const isNewPassword = !await bcrypt.compare(password, userExists.password)

          if (isNewPassword) {
            const bcryptGenSalt = await bcrypt.genSalt(10);
            const bcryptHash = await bcrypt.hash(password, bcryptGenSalt);
            password = bcryptHash;

            response = await usersCollection().findOneAndUpdate(
              { _id: userId },
              {
                $set: {
                  password,
                },
              },
            );

            await insertLogs({
              name,
              password,
            },
              userIPAddress,
              endpoint,
              userId
            );
          } else {
            await insertLogs({
              name,
            },
              userIPAddress,
              endpoint,
              userId
            );
          }

          return res.status(201).json({
            userId: response.value._id,
          });
        } else if (userExists.startedRegistrationAt && userExists.completedRegistrationAt) {
          /* Email address already exists */
          return res.status(403).json({ error: 'Account already exists' });
        } else {
          /* The user never started registration.  Possibly a server or db error. */
          return res.status(500).send();
        }
      } catch (error) {
        console.log(`error\n`, error);
        return res.json({ error: 'Unknown error' });
      }
    });
  }
};

module.exports = personalInfo;

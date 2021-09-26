const { ObjectId } = require('mongodb');
const { usersCollection } = require('../../db.js');

const verifyEmail = (req, res) => {
  const verificationToken = Number(req.query.verificationToken);
  const { my_match_userId } = req.cookies;

  usersCollection().findOne({ _id: ObjectId(my_match_userId) }, (err, userExists) => {
    if (err) {
      console.log(`err\n`, err);
      return res.json({ error: 'Error in verifyEmail' });
    }

    const { emailVerificationToken } = userExists;

    if (verificationToken === emailVerificationToken) {
      usersCollection().findOneAndUpdate(
        { _id: ObjectId(my_match_userId) },
        {
          $set: {
            emailVerified: new Date(),
          },
        },
        (err, user) => {
          if (err) {
            return res.json({ error: 'Unknown error' });
          } else {
            if (user.lastErrorObject.updatedExisting) return res.status(200).send();
            return res.json({ error: 'Unknown error' });
          }
        }
      );
    } else {
      return res.status(401).send({ message: 'Invalid Token' });
    }
  })
};

module.exports = verifyEmail;

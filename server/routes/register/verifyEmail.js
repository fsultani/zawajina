const { ObjectId } = require('mongodb');
const { usersCollection } = require('../../db.js');
const { returnServerError } = require('../../utils.js');

const verifyEmail = async (req, res) => {
  try {
    const tokenString = req.body.token.toString();
    const verificationToken = Number(req.body.token);
    const { my_match_authUserId } = req.cookies;

    if (
      !tokenString.length ||
      tokenString.length !== 5 ||
      isNaN(verificationToken)
    ) return res.status(403).send({ message: 'Invalid Token' });

    usersCollection().findOne({ _id: ObjectId(my_match_authUserId) }, async (_, userExists) => {
      const { emailVerificationToken } = userExists;
  
      if (verificationToken === emailVerificationToken) {
        await usersCollection().findOneAndUpdate(
          { _id: ObjectId(my_match_authUserId) },
          {
            $set: {
              emailVerified: new Date(),
            },
          });

        return res.status(200).send({ url: '/signup/profile' });
      }

      return res.status(403).send({ message: 'Invalid Token' });
    })
  } catch (error) {
    returnServerError(res, error);
  }
};

module.exports = verifyEmail;

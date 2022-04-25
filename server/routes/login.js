const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection } = require('../db.js');
const { comparePassword } = require('../models/user');
const { FetchData } = require('../utils.js');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { email, password, userIPAddress } = req.body;

  const user = await usersCollection().findOne({ email });
  if (!user) return res.sendStatus(401);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return res.sendStatus(401);

  const geoLocationData = await FetchData(`http://ip-api.com/json/${userIPAddress}`);
  const latitude = geoLocationData.lat;
  const longitude = geoLocationData.lon;

  const authUser = await usersCollection().findOneAndUpdate(
    { _id: ObjectId(user._id) },
    {
      $push: {
        loginData: {
          $each: [{
            time: new Date(),
            geoLocationData,
          }],
          $position: 0,
        },
      },
      $set: {
        location: { type: "Point", coordinates: [longitude, latitude] },
      }
    }
  );

  const token = jwt.sign({ my_match_userId: authUser.value._id }, JWT_SECRET, {
    expiresIn: '1 day',
  });
  res.status(201).json({ token });
});

module.exports = router;

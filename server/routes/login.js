const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection, insertLogs } = require('../db.js');
const { comparePassword } = require('../models/user');
const { FetchData } = require('../utils.js');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { email, password, userIPAddress } = req.body;

  const user = await usersCollection().findOne({ email });
  console.log(`user\n`, user);
  if (!user) return res.sendStatus(403);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return res.sendStatus(401);

  const userId = user._id;

  const authUser = await usersCollection().findOne(
    { _id: ObjectId(userId) }
  );

  const endpoint = req.originalUrl;

  await insertLogs({}, userIPAddress, endpoint, userId);

  const token = jwt.sign({ my_match_userId: authUser._id }, JWT_SECRET, {
    expiresIn: '1 day',
  });
  res.status(201).json({ token });
});

module.exports = router;

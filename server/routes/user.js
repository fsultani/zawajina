const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');

const authenticateToken = require('../config/auth');
const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

// Grab the user from the db
router.get('/api/info/:userId', authenticateToken, (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId }, (err, user) => {
    if (err || !user) return res.sendStatus(404);
    res.status(201).send({ user });
  })
});

module.exports = router;

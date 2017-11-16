const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

// Grab the user from the db
router.get('/api/info/:member', (req, res, next) => {
  if (req.headers['user-cookie']) {
    const token = req.headers['user-cookie']
    const decodedToken = jwt.decode(token, JWT_SECRET)
    User.findOne({ _id: req.params.member }, (err, member) => {
      member ? res.json({ member: member }) : res.send(err)
    })
  } else {
    res.send("Unauthorized")
  }
});

module.exports = router;

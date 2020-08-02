// routes/user
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

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user !== null) {
      // res.status(201).send({ name: user.name })
      res.render('app/profile', {
        user: user.toJSON(),
        styles: [
          'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
          '/static/client/app/app-global-styles.css',
          '/static/client/app/components/NavBar/nav-bar-styles.css',
          '/static/client/app/profile-styles.css',
        ],
      });
    } else {
      res.sendStatus(403);
    }
  })
})

// Grab the user from the db
router.get('/api/info/:userId', (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId }, (err, user) => {
    if (err || !user) return res.sendStatus(404);
    res.status(201).send({ user });
  })
});

module.exports = router;

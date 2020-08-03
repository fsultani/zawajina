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
router.get('/api/info', authenticateToken, (req, res, next) => {
  if (req.user) res.send(req.user);
});

module.exports = router;

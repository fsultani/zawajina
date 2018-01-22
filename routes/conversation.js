var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')

router.get('/api/:id', (req, res) => {
  Message.find({ conversation: req.params.id}, (err, messages) => {
    res.json({ messages: messages })
  })
})

router.get('/api/exists/:id', (req, res) => {
  Conversation.findOne({ users: req.params.id }, (err, conversation) => {
    conversation ? res.json({ conversation: conversation }) : res.json({ err: err })
  })
})

module.exports = router;

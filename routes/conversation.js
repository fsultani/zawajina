var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')

// public/javascripts/views/conversation.js
router.get('/api/:id', (req, res) => {
  Message.find({ conversation: req.params.id}).exec((err, messages) => {
    res.json({ messages: messages })
  })
})

// public/javascripts/views/memberProfile.js
router.get('/api/exists/:member_id/:current_user_id', (req, res) => {
  Conversation.findOne({
    $and: [
      { users: req.params.member_id },
      { users: req.params.current_user_id }
    ]}, (err, conversation) => {
    conversation ? res.json({ conversation: conversation }) : res.json({ err: err })
  })
})

router.get('/api/totalCount/:current_user_id', (req, res) => {
  Message.find({
    unread: true,
    to_user_id: req.params.current_user_id
  }).exec((err, messages) => {
    res.json({ messages })
  })
})

module.exports = router;

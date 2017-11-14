const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  res.redirect('/users/' + req.user.username)
})

/****************************************************************************************************
// Get the logged in user's profile
****************************************************************************************************/

router.get('/member', ensureAuthenticated, (req, res, next) => {
  Conversation.find({ users: req.user._id }, (err, conversations) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
      var conversations_count = 0
      conversations.map((conversation) => {
        if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
          conversations_count += 1
        }
      })
      res.render('user_profile', {
        conversations_count: conversations_count,
        conversations: conversations,
        helpers: {
          if_eq: function(a, b, options) {
            if (a == b) {
              return options.fn(this);
            } else {
              return options.inverse(this)
            }
          }
        }
      })
    })
  })
})

router.get('/:member', (req, res, next) => {
  console.log("req.params\n", req.params)
  User.findOne({ username: req.params.member }, (err, member) => {
    // res.send({member: member})
    res.json({ member: member })
  })
});

module.exports = router;

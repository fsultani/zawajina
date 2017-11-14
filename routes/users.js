const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

router.get('/:member', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/info', (req, res, next) => {
  // User.findOne({ username: req.params.member }, (err, member) => {
  //   res.send({member: member})
  // })
});

// router.get('/profile', ensureAuthenticated, (req, res, next) => {
//   res.redirect('/users/' + req.user.username)
// })

/****************************************************************************************************
// Get the logged in user's profile
****************************************************************************************************/

// router.get('/member', ensureAuthenticated, (req, res, next) => {
//   Conversation.find({ users: req.user._id }, (err, conversations) => {
//     User.findOne({ _id: req.user._id }, (err, user) => {
//       var conversations_count = 0
//       conversations.map((conversation) => {
//         if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
//           conversations_count += 1
//         }
//       })
//       res.render('user_profile', {
//         conversations_count: conversations_count,
//         conversations: conversations,
//         helpers: {
//           if_eq: function(a, b, options) {
//             if (a == b) {
//               return options.fn(this);
//             } else {
//               return options.inverse(this)
//             }
//           }
//         }
//       })
//     })
//   })
// })

module.exports = router;

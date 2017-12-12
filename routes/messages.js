const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

/****************************************************************************************************
// Get the logged in user's messages
****************************************************************************************************/

router.get('/api/all-messages', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.find({ username: decodedUser.username}, (err, user) => {
    Conversation.find({ users: user[0]._id}).sort({ updated_at: -1 }).exec((err, conversations) => {
      res.json({ conversations: conversations })
    })
  })
})

/****************************************************************************************************
// Send a new message to another user
****************************************************************************************************/

router.post('/api/new-message', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  Promise.all([
    User.find({ _id: req.body.userId }),
    User.find({ username: decodedUser.username }),
  ]).then(([ user, member ]) => {
    console.log('user\n', user)
    console.log('member\n', member)
  })

  // const contactedUser = (person, cb) => {
  //   User.findOne({ _id: person }).exec((err, user) => {
  //     cb(user)
  //   })
  // }

  // const member = (member, cb) => {
  //   User.find({ username: member }).exec((err, member) => {
  //     cb(null, member[0])
  //   })
  // }

  // contactedUser(req.body.userId, (err, user) => {
  //   console.log("user\n", user)
  // })

  // member(decodedUser.username, (err, member) => {
  //   console.log('member._id\n', member._id)
  // })

  // User.findOne({ _id: req.body.userId }, (err, user) => {
  //   console.log("user\n", user)
  //   User.findOne({ username: decodedUser.username }, (err, member) => {
  //     console.log("member\n", member)
  //     Conversation.find({ $and: [{ users: user._id }, { users: member._id }] }, (err, conversation) => {
  //       if (conversation.length === 0) {
  //         console.log("conversation\n", conversation)
  //         // Conversation.create({
  //         //   created_at: Date.now(),
  //         //   updated_at: Date.now(),
  //         //   created_by_user_first_name: member.first_name,
  //         //   created_by_user_id: member._id,
  //         //   sent_to_user_first_name: user.first_name,
  //         //   sent_to_user_id: user._id,
  //         //   unread: true
  //         // }, (err, conversation) => {
  //         //   if (err) {
  //         //     console.log(err)
  //         //   } else {
  //         //     console.log("conversation\n", conversation)
  //         //     Message.create({
  //         //       message: req.body.message,
  //         //       from: member.first_name,
  //         //       to: user.first_name,
  //         //       from_user_id: member._id,
  //         //       to_user_id: user._id,
  //         //       created_at: Date.now(),
  //         //       unread: true
  //         //     }, (err, message) => {
  //         //       if (err) {
  //         //         console.log(err)
  //         //       } else {
  //         //         console.log("message\n", message)
  //         //         conversation.users.push(member, user)
  //         //         message.conversations.push(conversation)
  //         //         conversation.save()
  //         //         message.save()
  //         //         // res.redirect('/conversations/' + conversation._id)
  //         //       }
  //         //     })
  //         //   }
  //         // })
  //       } else {
  //         console.log("conversation > 1\n", conversation)
  //         res.redirect('/conversations/' + conversation[0]._id)
  //       }
  //     })
  //   })
  // })
})

module.exports = router;

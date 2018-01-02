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
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.find({ username: decodedUser.username}, (err, user) => {
    Conversation.find({ users: user[0]._id}).sort({ updated_at: -1 }).exec((err, conversations) => {
      // console.log("conversations\n", conversations)
      Message.find({}, (err, message) => {
        // console.log("message\n", message)
      })
      res.json({ conversations: conversations })
    })
  })
})

/****************************************************************************************************
// Send a new message to another user
****************************************************************************************************/

router.post('/api/new-message', (req, res, next) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  Promise.all([
    User.findOne({ _id: req.body.userId }),
    User.findOne({ username: decodedUser.username }),
  ]).then(([ user, member ]) => {
    Conversation.findOne({
      $and: [
      {
        users: user._id
      },
      {
        users: member._id
      }]
    }, (err, conversation) => {
      if (conversation) {
        // Conversation exists, so redirect to the conversation screen
      } else {
        Conversation.create({
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by_user_first_name: member.first_name,
          created_by_user_id: member._id,
          sent_to_user_first_name: user.first_name,
          sent_to_user_id: user._id,
          unread: true,
          users: [member,user]
        }, (err, conversation) => {
          if (err) {
            console.log(err)
          } else {
            Message.create({
              message: req.body.message,
              from: member.first_name,
              to: user.first_name,
              from_user_id: member._id,
              to_user_id: user._id,
              created_at: Date.now(),
              unread: true,
              conversation: conversation
            }, (err, message) => {
              if (err) {
                console.log(err)
              } else {
                message.save()
                conversation.save()
                res.json({ conversation: conversation })
              }
            })
          }
        })
      }
    })
  })
})

module.exports = router;

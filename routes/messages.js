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

  User.findOne({ _id: req.body.userId }, (err, user) => {
    User.findOne({ username: decodedUser.username }, (err, member) => {
      Conversation.findOne({ $and: [{ users: user._id }, { users: member._id }] }, (err, conversation) => {
        if (conversation) {
          console.log("conversation exists\n", conversation)
        } else {
          Conversation.create({
            created_at: Date.now(),
            updated_at: Date.now(),
            created_by_user_first_name: member.first_name,
            created_by_user_id: member._id,
            sent_to_user_first_name: user.first_name,
            sent_to_user_id: user._id,
            unread: true
          }, (err, conversation) => {
            console.log("conversation\n", conversation)
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
                unread: true
              }, (err, message) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log("message\n", message)
                  conversation.users.push(member, user)
                  message.conversations.push(conversation)
                  conversation.save()
                  message.save()
                }
              })
            }
          })
        }
      })
    })
  })
})

module.exports = router;
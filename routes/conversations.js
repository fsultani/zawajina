var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

// Get the conversation with the selected member
router.get('/:id', ensureAuthenticated, (req, res, next) => {

  // Find all messages that contain the conversation ID
  Message.find({conversations: req.params.id}, (err, messages) => {
    // console.log('messages\n', messages)

    // Find all conversations for the logged in user in order to keep track of the total conversations count
    Conversation.find({ users: req.user._id }, (err, total_conversations_count) => {

      // Find the specific conversation with the selected user to label it as 'read' (false)
      Conversation.findById(req.params.id, (err, current_conversation) => {
        function find_unread_messages_1(message) {
          console.log('message\n', message)
          return ((req.user._id.toString() === message.from_user_id) && (message.conversations[0].toString() === current_conversation._id.toString()) && message.unread)
        }

        function find_unread_messages_2(message) {
          return ((req.user._id.toString() === message.to_user_id ) && (message.conversations[0].toString() === current_conversation._id.toString()) && message.unread)
        }

        if(messages.some(find_unread_messages_1)) {
          console.log("\nfind_unread_messages_1 is true\n")
          // console.log('current_conversation\n', current_conversation)
          var conversations_count = 0
          total_conversations_count.map((each_conversation) => {
            console.log('each_conversation\n', each_conversation)
            if ((req.user._id.toString() === each_conversation.sent_to_user_id) && (req.user._id.toString() != messages[messages.length - 1].from_user_id) && each_conversation.unread) {
              conversations_count += 1
            }
          })

          var all_conversations_count = 0
          if (conversations_count > 0) {
            all_conversations_count = conversations_count - 1
          } else {
            all_conversations_count = conversations_count
          }
          console.log('all_conversations_count\n', all_conversations_count)
          res.render('user_messages', {
            conversations_count: all_conversations_count,
            user_messages: messages,
            conversation_id: req.params.id,
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
        } else if(messages.some(find_unread_messages_2)) {
          // console.log("find_unread_messages_2 is true")
          // console.log('current_conversation\n', current_conversation)
          current_conversation.unread = false
          current_conversation.save((err, success) => {
            var conversations_count = 0
            total_conversations_count.map((each_conversation) => {
              // console.log('each_conversation\n', each_conversation)
              if (req.user._id.toString() === each_conversation.sent_to_user_id && each_conversation.unread) {
                conversations_count += 1
              }
            })
            var all_conversations_count = 0
            if (conversations_count > 0) {
              all_conversations_count = conversations_count - 1
            } else {
              all_conversations_count = conversations_count
            }
            res.render('user_messages', {
              conversations_count: all_conversations_count,
              user_messages: messages,
              conversation_id: req.params.id,
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
        } else {
          // console.log("Both are false")
          // console.log('current_conversation\n', current_conversation)
          var conversations_count = 0
          total_conversations_count.map((each_conversation) => {
            if (req.user._id.toString() === each_conversation.sent_to_user_id && each_conversation.unread) {
              conversations_count += 1
            }
          })
          var all_conversations_count = 0
          if (conversations_count > 0) {
            all_conversations_count = conversations_count - 1
          } else {
            all_conversations_count = conversations_count
          }
          res.render('user_messages', {
            conversations_count: all_conversations_count,
            user_messages: messages,
            conversation_id: req.params.id,
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
        }
      })
    })

    messages.map((message, index) => {
      if (req.user._id.toString() === message.to_user_id && message.unread) {
        Message.findByIdAndUpdate(message._id, { $set: { unread: false }}, { new: true }, (err, data) => {})
      }
    })
  })
})

module.exports = router;

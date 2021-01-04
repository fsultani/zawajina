const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

/****************************************************************************************************
// Get the logged in user's messages
****************************************************************************************************/

router.get("/api/all-messages", (req, res, next) => {
  const token = req.headers["authorization"];
  const decodedUser = jwt.decode(token, JWT_SECRET);
  User.findOne({ username: decodedUser.username }, (err, user) => {
    Message.aggregate([
      {
        $match: {
          $or: [
            {
              from_user_id: user._id.toString(),
            },
            {
              to_user_id: user._id.toString(),
            },
          ],
        },
      },
      {
        $group: {
          _id: "$conversation",
          lastMessage: { $last: "$$ROOT" },
        },
      },
    ]).exec((err, lastMessage) => {
      res.json({ lastMessage });
    });
  });
});

/****************************************************************************************************
// Send a new message to another user
****************************************************************************************************/

router.post("/api/new-message", (req, res, next) => {
  const token = req.headers["authorization"];
  const decodedUser = jwt.decode(token, JWT_SECRET);
  Promise.all([
    User.findOne({ _id: req.body.memberId }),
    User.findOne({ username: decodedUser.username }),
  ]).then(([user, member]) => {
    Conversation.findOne(
      {
        $and: [
          {
            users: user._id,
          },
          {
            users: member._id,
          },
        ],
      },
      (err, conversation) => {
        if (conversation) {
          // Conversation exists, so redirect to the conversation screen
        } else {
          Conversation.create(
            {
              created_at: Date.now(),
              updated_at: Date.now(),
              created_by_user_first_name: member.name,
              created_by_user_id: member._id,
              sent_to_user_first_name: user.name,
              sent_to_user_id: user._id,
              unread: true,
              users: [member, user],
            },
            (err, conversation) => {
              if (err) {
                console.log(err);
              } else {
                Message.create(
                  {
                    message: req.body.message,
                    from: member.name,
                    to: user.name,
                    from_user_id: member._id,
                    to_user_id: user._id,
                    created_at: Date.now(),
                    unread: true,
                    conversation: conversation,
                  },
                  (err, message) => {
                    if (err) {
                      console.log(err);
                    } else {
                      message.save();
                      conversation.save();
                      res.json({ conversation: conversation });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

/****************************************************************************************************
// Reply to a message
****************************************************************************************************/

router.post("/api/reply", (req, res, next) => {
  const token = req.headers["authorization"];
  const decodedUser = jwt.decode(token, JWT_SECRET);
  Conversation.findOne({ _id: req.body.conversationId }, (err, conversation) => {
    const to =
      conversation.sent_to_user_id === req.body.memberId
        ? conversation.created_by_user_first_name
        : conversation.sent_to_user_first_name;
    const from_user_id =
      conversation.sent_to_user_id === req.body.memberId
        ? conversation.sent_to_user_id
        : conversation.created_by_user_id;
    const to_user_id =
      conversation.sent_to_user_id === req.body.memberId
        ? conversation.created_by_user_id
        : conversation.sent_to_user_id;

    Message.create(
      {
        message: req.body.reply,
        from: req.body.memberFirstName,
        to,
        from_user_id,
        to_user_id,
        created_at: Date.now(),
        unread: true,
        conversation: conversation,
      },
      (err, message) => {
        if (err) {
          console.log(err);
        } else {
          message.save();
          res.status(201).json({ reply: message });
        }
      }
    );
  });
});

router.put("/api/:conversationId/:messageId", (req, res) => {
  Message.findByIdAndUpdate(req.params.messageId, { $set: { unread: false } }, (err, message) => {
    res.status(201).end();
  });
  Conversation.findByIdAndUpdate(
    req.params.conversationId,
    { $set: { unread: false } },
    (err, conversation) => {
      res.status(201).end();
    }
  );
});
module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

// public/javascripts/views/conversation.js
router.get("/api/:id", (req, res) => {
  Message.find({ conversation: req.params.id }).exec((err, messages) => {
    res.json({ messages: messages });
  });
});

// public/javascripts/views/memberProfile.js
router.get("/api/exists/:member_id/:current_user_id", (req, res) => {
  Conversation.findOne(
    {
      $and: [{ users: req.params.member_id }, { users: req.params.current_user_id }],
    },
    (err, conversation) => {
      conversation ? res.json({ conversation: conversation }) : res.json({ err: err });
    }
  );
});

router.get("/api/totalCount/:current_user_id", (req, res) => {
  Message.find({
    unread: true,
    to_user_id: req.params.current_user_id,
  }).exec((err, messages) => {
    res.json({ messages });
  });
});

module.exports = router;

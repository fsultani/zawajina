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

router.use(function(req, res, next) {
	Conversation.find({ users: req.user._id }, (err, conversations) => {
		var conversations_count = 0
		conversations.map((conversation) => {
			if (req.user._id.toString() === conversation.sent_to_user_id) {
				conversations_count += 1
			}
		})
		res.locals.conversations_count = conversations_count
	})
	next()
})

// Get the conversation with the selected member
router.get('/:id', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user._id }, (err, user) => {
		Message.find({conversations: req.params.id}, (err, messages) => {
			res.render('user_messages', {
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

			messages.map((message, index) => {
				if (req.user._id.toString() === message.to_user_id) {
					if (message.unread) {
						Message.findByIdAndUpdate(message._id, { $set: { unread: false }}, { new: true }, (err, data) => {})
					}
				}
			})
		})
	})
})

module.exports = router;
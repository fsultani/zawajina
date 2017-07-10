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

// router.use(function(req, res, next) {
// 	Conversation.find({ users: req.user._id }, (err, conversations) => {
// 		var conversations_count = 0
// 		conversations.map((conversation) => {
// 			if (req.user._id.toString() === conversation.sent_to_user_id) {
// 				conversations_count += 1
// 			}
// 		})
// 		res.locals.conversations_count = conversations_count
// 	})
// 	next()
// })

// Get the conversation with the selected member
router.get('/:id', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user._id }, (err, user) => {
		Message.find({conversations: req.params.id}, (err, messages) => {
			Conversation.update({ $and: [{ created_by_user_id: messages[0].from_user_id }, { sent_to_user_id: req.user._id }, { unread: true }] }, { $set: { unread: false }}, (err, conversation) => {})
			Conversation.find({ users: req.user._id }, (err, conversations) => {
				User.findOne({ _id: req.user._id }, (err, user) => {
					
					// Find all unread conversations from all members
					var conversations_count = 0
					conversations.map((conversation) => {
						if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
							conversations_count += 1
						}
					})
					res.render('user_messages', {
						conversations_count: conversations_count,
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
			})

			messages.map((message, index) => {
				if (req.user._id.toString() === message.to_user_id && message.unread) {
					Message.findByIdAndUpdate(message._id, { $set: { unread: false }}, { new: true }, (err, data) => {})
				}
			})
		})
	})
})

module.exports = router;

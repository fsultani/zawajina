var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

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
// 			console.log('conversation\n', conversation)
// 			if (req.user._id.toString() === conversation.sent_to_user_id) {
// 				conversations_count += 1
// 			}
// 		})
// 		res.locals.conversations_count = conversations_count
// 	})
// 	next()
// })

// Get the logged in user's messages
router.get('/', ensureAuthenticated, (req, res, next) => {
	Conversation.find({ users: req.user._id }, (err, conversations) => {
		User.findOne({ _id: req.user._id }, (err, user) => {
			var conversations_count = 0
			conversations.map((conversation) => {
				if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
					conversations_count += 1
				}
			})
			res.render('user_messages', {
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

// Get the contact page to contact another member
// If no conversations with the user exist, create a new conversation
// Else, redirect to the existing conversation
router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.params.user_id }, (err, member) => {
		Conversation.find({ $and: [{ users: req.user._id }, { users: member._id }] }, (err, conversation) => {
			if (conversation.length === 0) {
				Conversation.find({ users: req.user._id }, (err, conversations) => {
					var conversations_count = 0
					conversations.map((conversation) => {
						if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
							conversations_count += 1
						}
					})
					res.render('contact_member', {
						conversations_count: conversations_count,
						member: member
					})
				})
			} else {
				res.redirect('/conversations/' + conversation[0]._id)
			}
		})
	})
});

// Send a new message to another user
router.post('/:user_id', ensureAuthenticated, (req, res, next) => {
	User.findById({ _id: req.params.user_id }, (err, user) => {
		Conversation.find({ $and: [{ users: req.user._id }, { users: user._id }] }, (err, conversation) => {
			if (conversation.length === 0) {
				Conversation.create({
					created_at: Date.now(),
					created_by_user_name: req.user.first_name,
					created_by_user_id: req.user._id,
					sent_to_user_name: user.first_name,
					sent_to_user_id: user._id,
					unread: true
				}, (err, conversation) => {
					if (err) {
						console.log(err)
					} else {
						Message.create({
							message: req.body.message,
							from: req.user.first_name,
							to: user.first_name,
							from_user_id: req.user._id,
							to_user_id: user._id,
							created_at: Date.now(),
							unread: true,
							view_count: 0
						}, (err, message) => {
							if (err) {
								console.log(err)
							} else {
								conversation.users.push(req.user, user)
								message.conversations.push(conversation)
								conversation.save()
								message.save()
								res.redirect('/conversations/' + conversation._id)
							}
						})
					}
				})
			} else {
				res.redirect('/conversations/' + conversation[0]._id)
			}
		})
	})
})

// Reply to a message
router.post('/reply/:conversation_id', ensureAuthenticated, (req, res, next) => {
	Conversation.findById(req.params.conversation_id, (err, conversation) => {
		if (req.user._id == conversation.created_by_user_id) {
			User.findById(conversation.sent_to_user_id, (err, user) => {
				Message.create({
					message: req.body.message,
					from: req.user.first_name,
					to: user.first_name,
					from_user_id: req.user._id,
					to_user_id: user._id,
					created_at: Date.now(),
					unread: true,
					view_count: 0
				}, (err, message) => {
					if (err) {
						console.log(err)
					} else {
						message.conversations.push(conversation._id)
						message.save()
						res.redirect('/conversations/' + conversation._id)
					}
				})
			})
		} else {
			User.findById(conversation.created_by_user_id, (err, user) => {
				Message.create({
					message: req.body.message,
					from: req.user.first_name,
					to: user.first_name,
					from_user_id: req.user._id,
					to_user_id: user._id,
					created_at: Date.now(),
					unread: true,
					view_count: 0
				}, (err, message) => {
					if (err) {
						console.log(err)
					} else {
						message.conversations.push(conversation._id)
						message.save()
						res.redirect('/conversations/' + conversation._id)
					}
				})
			})
		}
	})
});

module.exports = router;

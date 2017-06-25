// The sender
// console.log("\nreq.user\n", req.user)

// The user the message is being sent to
// console.log("\nuser\n", user)

// The message
// console.log("\nreq.body\n", req.body)

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

router.get('/profile', ensureAuthenticated, (req, res, next) => {
	res.redirect('/users/' + req.user.username)
})

// Get the logged in user's profile
router.get('/member', ensureAuthenticated, (req, res, next) => {
	Conversation.find({ users: req.user._id }, (err, conversations) => {
		User.findOne({ _id: req.user._id }, (err, user) => {
			res.render('user_profile', {
				user: user,
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

// Get a member's profile
router.get('/:username', ensureAuthenticated, (req, res, next) => {
	User.findOne({ username: req.params.username }, (err, user) => {
		Conversation.find({ $and: [{ users: req.user._id }, { users: user._id }] }, (err, conversation) => {
			if (conversation.length === 0) {
				res.render('member_profile', { user: user })
			} else {
				res.redirect('/users/conversations/' + conversation[0]._id)
			}
		})
	})
});

// Get the conversation with the selected member
router.get('/conversations/:id', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user._id }, (err, user) => {
		Message.find({conversations: req.params.id}, (err, message) => {
			res.render('user_profile', {
				user: user,
				user_messages: message,
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
})

// Send a new message to another user
router.post('/messages/:user_id', ensureAuthenticated, (req, res, next) => {
	User.findById({ _id: req.params.user_id }, (err, user) => {
		Conversation.find({ users: req.params.user_id }, (err, conversation) => {
			if (conversation.length === 0) {
				Conversation.create({
					created_at: Date.now(),
					created_by_user_name: req.user.first_name,
					created_by_user_id: req.user._id,
					sent_to_user_name: user.first_name,
					sent_to_user_id: user._id
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
							created_at: Date.now()
						}, (err, message) => {
							if (err) {
								console.log(err)
							} else {
								conversation.users.push(req.user, user)
								message.conversations.push(conversation)
								conversation.save()
								message.save()
								res.redirect('/users/conversations/' + conversation._id)
							}
						})
					}
				})
			} else {
				res.redirect('/users/conversations/' + conversation[0]._id)
			}
		})
	})
})

// Reply to a message
router.post('/messages/reply/:conversation_id', ensureAuthenticated, (req, res, next) => {
	Conversation.findById(req.params.conversation_id, (err, conversation) => {
		if (req.user._id == conversation.created_by_user_id) {
			User.findById(conversation.sent_to_user_id, (err, user) => {
				Message.create({
					message: req.body.message,
					from: req.user.first_name,
					to: user.first_name,
					from_user_id: req.user._id,
					to_user_id: user._id,
					created_at: Date.now()
				}, (err, message) => {
					if (err) {
						console.log(err)
					} else {
						message.conversations.push(conversation._id)
						message.save()
						res.redirect('/users/conversations/' + conversation._id)
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
					created_at: Date.now()
				}, (err, message) => {
					if (err) {
						console.log(err)
					} else {
						message.conversations.push(conversation._id)
						message.save()
						res.redirect('/users/conversations/' + conversation._id)
					}
				})
			})
		}
	})
});

module.exports = router;

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

// Get the logged in user's messages
router.get('/', ensureAuthenticated, (req, res, next) => {
	Conversation.find({ users: req.user._id }, (err, conversations) => {
		User.findOne({ _id: req.user._id }, (err, user) => {
			res.render('user_messages', {
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

// Get the contact page to contact another member
router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.params.user_id }, (err, user) => {
		Conversation.find({ $and: [{ users: req.user._id }, { users: user._id }] }, (err, conversation) => {
			console.log("conversation.length\n", conversation.length)
			if (conversation.length === 0) {
				res.render('contact_member', { user: user })
			} else {
				res.redirect('/conversations/' + conversation[0]._id)
			}
		})
	})
});

// Send a new message to another user
router.post('/:user_id', ensureAuthenticated, (req, res, next) => {
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
					created_at: Date.now()
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
					created_at: Date.now()
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

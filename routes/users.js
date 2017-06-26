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
// router.get('/:username', ensureAuthenticated, (req, res, next) => {
// 	User.findOne({ username: req.params.username }, (err, user) => {
// 		Conversation.find({ $and: [{ users: req.user._id }, { users: user._id }] }, (err, conversation) => {
// 			if (conversation.length === 0) {
// 				res.render('member_profile', { user: user })
// 			} else {
// 				res.redirect('/conversations/' + conversation[0]._id)
// 			}
// 		})
// 	})
// });

router.get('/:username', ensureAuthenticated, (req, res, next) => {
	User.findOne({ username: req.params.username }, (err, user) => {
		res.render('member_profile', { user: user })
	})
});

module.exports = router;

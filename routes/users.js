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
//   Conversation.find({ users: req.user._id }, (err, conversations) => {
//     var conversations_count = 0
//     conversations.map((conversation) => {
//       if (req.user._id.toString() === conversation.sent_to_user_id) {
//         conversations_count += 1
//       }
//     })
//     res.locals.conversations_count = conversations_count
//   })
//   next()
// })

router.get('/profile', ensureAuthenticated, (req, res, next) => {
	res.redirect('/users/' + req.user.username)
})

// Get the logged in user's profile
router.get('/member', ensureAuthenticated, (req, res, next) => {
	Conversation.find({ users: req.user._id }, (err, conversations) => {
		User.findOne({ _id: req.user._id }, (err, user) => {
			var conversations_count = 0
			conversations.map((conversation) => {
				if (req.user._id.toString() === conversation.sent_to_user_id && conversation.unread) {
					conversations_count += 1
				}
			})
			res.render('user_profile', {
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

router.get('/:username', ensureAuthenticated, (req, res, next) => {
	User.findOne({ username: req.params.username }, (err, member) => {
		res.render('member_profile', { member: member })
	})
});

module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user')
var Message = require('../models/message')

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/');
	}
}

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	res.redirect('/users/' + req.user.username)
});

router.get('/member', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.user.username }).populate('messages').exec((err, user) => {
		const all_messages = []
		user.messages.map((message_obj) => { all_messages.push(message_obj) })

		const groups = Object.create(null)

		all_messages.forEach((message, index) => {
			groups[message.from_user_id] = groups[message.from_user_id] || []
			groups[message.from_user_id].push(message)
		})
		
		// all_messages.forEach((message, index) => {
		// 	groups["message_object " + index] = "This is an object at index " + index
		// })

		const result = Object.keys(groups).map((k) => {
			const temp = {}
			temp[k] = groups[k]
			return temp
		})

		console.log(result)
		console.log(groups)

		res.render('user_profile', { user: user, messages: result })
	})
});

router.get('/:username', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.username }, (err, user) => {
		res.render('member_profile', { user: user })
	})
});

// Send a message to another user
router.post('/messages/:user_id', ensureAuthenticated, function(req, res, next) {
	User.findById({ _id: req.params.user_id }, function(err, user) {
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
				user.messages.push(message)
				req.user.messages.push(message)
				user.save((err, final) => {})
				req.user.save((err, final) => {})
				res.redirect('/users/member')
			}
		})
	})
});

// Reply to a message
router.post('/messages/reply/:from_user_id', ensureAuthenticated, function(req, res, next) {
	// The ID of the user the reply is being sent to
	// console.log("req.user\n" + req.user)
	User.findById({ _id: req.params.from_user_id }, function(err, user) {
		// The user the message is being sent to
		// console.log(user)
		
		// The message
		// console.log(req.body)
		
		// The sender
		// console.log(req.user)
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
				user.messages.push(message)
				user.save((err, final) => {console.log("user.save\n" + final);})
				req.user.messages.push(message)
				req.user.save((err, final) => {console.log("\n\nreq.user.save\n" + final);})
				res.redirect('/users/member')
			}
		})
	})
});

module.exports = router;

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
		let messages_array = []
		user.messages.map((index) => {
			messages_array.push(index.from_user_id)
		})
		let senders = []
		messages_array.map((message) => {
			if (!senders.includes(message)) { senders.push(message)}
		})

		// Message.find({ from_user_id: {"$in": senders}}, (err, msg) => {})
		Message.find({ from_user_id: {"$in": senders}}).exec((err, msg) => { console.log(msg)})
		res.render('user_profile', { user: user })
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

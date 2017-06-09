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
		console.log(user)
		const all_messages = []
		user.messages.map((message_obj) => { all_messages.push(message_obj) })
		
		const message_sent_by = []
		all_messages.map((message_obj) => { message_sent_by.push(message_obj.from_user_id) }).sort()

		let user_id_count = message_sent_by.reduce(function(allIds, id) {
			id in allIds ? allIds[id]++ : allIds[id] = 1
			return allIds
		}, {})

		const distinct_user_ids = Object.keys(user_id_count)

		// console.log("All user IDs\n", message_sent_by)
		// console.log("\nDistinct IDs\n", distinct_user_ids)

		function message_object(sent_by, message_body) {
			this.sent_by = sent_by
			this.message_body = message_body
		}

		// console.log(all_messages)
		// all_messages.map((message) => { console.log(message) })

		// distinct_user_ids.map((id) => {
		// 	const new_message = new message_object(id, )
		// })

		// const myMessage = new message_object("Farid", "Hi there")
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

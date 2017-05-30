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

router.get('/:username', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.username }, function(err, user) {
		if (err) throw err
		else {
			if (req.user.username == user.username) {
				res.render('user_profile', {
					user: req.user
				})
			} else {
				res.render('member_profile', {
					user: user
				})
			}
		}
	})
});

router.post('/messages/:user_id', ensureAuthenticated, function(req, res, next) {
	// This is the message being sent
	// console.log(req.body)
	User.findById({ _id: req.params.user_id }, function(err, user) {
		// This is the user the message is being sent to
		// console.log(user)
		var newMessage = new Message ({
			message: req.body.message,
			from: req.user.first_name,
			userId: req.user._id
		})
		user.messages.push(newMessage)
		user.save(function(err, updatedUser) {
			if (err) {
				console.log(err)
			} else {
				// console.log(updatedUser)
				res.redirect('/users/' + req.user.username)
			}
		})
	})
});

router.post('/messages/reply/:user_id', ensureAuthenticated, function(req, res, next) {
	// This is the ID of the user the reply is being sent to
	// console.log(req.params)
	User.findById({ _id: req.params.user_id }, function(err, user) {
		// This is the user the message is being sent to
		console.log(user)
		console.log(req.body)
		console.log(req.user)
		// var newMessage = new Message ({
		// 	message: req.body.message,
		// 	from: req.user.first_name,
		// 	userId: req.user._id
		// })
		// user.messages.push(newMessage)
		// user.save(function(err, updatedUser) {
		// 	if (err) {
		// 		console.log(err)
		// 	} else {
		// 		console.log(updatedUser)
		// 		res.redirect('/users/' + req.user.username)
		// 	}
		// })
	})
});

module.exports = router;

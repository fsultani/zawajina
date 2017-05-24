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
				user_messages_array = []
				sent_messages_array = []
				Message.find(function(err, message) {
					let logged_in_user = [...new Set(message.map(item => item.username_from))]
					// console.log(logged_in_user)
					message.map((index) => {
						if (req.user.username == index.username_from) {
							user_messages_array.push(index)
						}
					})
					// console.log(user_messages_array)

					let distinct_to = [...new Set(user_messages_array.map(item => item.username_to))]

					user_messages_array.map((index) => {
						distinct_to.map((person) => {
							console.log(person)
						})
						if(index.username_to == distinct_to[1]) {
							sent_messages_array.push(index)
						}
					})
					console.log(sent_messages_array)

					res.render('user_profile', {
						user: req.user,
						messages: user_messages_array
					})
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
	User.findById({ _id: req.params.user_id }, function(err, user) {
		var newMessage = new Message ({
			from: req.user.first_name,
			to: user.first_name,
			username_from: req.user.username,
			username_to: user.username,
			message: req.body.message
		})
		newMessage.save()
		console.log("\nThe message:")
		console.log(newMessage)
		res.redirect('/users/' + req.user.username)
	})
	// User.findByIdAndUpdate(req.params.user_id,{
	// 	$set: {
	// 		inbox: req.body.message
	// 	}
	// }, function(err, success) {
	// 	console.log("Success", success)
	// })
});

module.exports = router;

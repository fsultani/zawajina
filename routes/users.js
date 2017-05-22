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

router.get('/:username', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.username }, function(err, user) {
		if (err) throw err
		else {
			if (req.user.username == user.username) {
				Message.find(function(err, message) {
					res.render('user_profile', {
						user: req.user,
						messages: message
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
	console.log("The user that's logged in:")
	console.log(req.user)
	User.findById({ _id: req.params.user_id }, function(err, user) {
		console.log("The user being messaged:")
		console.log(user)

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

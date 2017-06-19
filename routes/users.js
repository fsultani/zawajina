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

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	res.redirect('/users/' + req.user.username)
});

// Get the logged in user's profile
router.get('/member', ensureAuthenticated, function(req, res, next) {
	// Currently logged in user
	// console.log("req.user\n", req.user)
	Conversation.find({ users: req.user._id }).exec((err, conversations) => {
		// console.log("\nconversations\n", conversations)
		var sent_to_array = []
		conversations.forEach((convo) => {
			User.findOne({ _id: convo.users[1]}).exec((err, user) => {
				sent_to_array.push(user)
			})
		})
		User.findOne({ _id: req.user._id }).exec((err, user) => {
			res.render('user_profile', {
				user: user,
				conversations: sent_to_array,
				helpers: {
		      not_eq: function(a, b, options) {
		        if (a != b) {
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

// Get the conversation with the selected member
router.get('/conversations/:id', ensureAuthenticated, function(req, res, next) {
	User.findOne({ _id: req.user._id }).exec((err, user) => {
		Message.find({ to_user_id: req.params.id}).exec((err, member) => {
			res.render('user_profile', {
				user: user,
				user_messages: member
			})
		})
	})
})

// Get the logged in user's profile
// router.get('/member', ensureAuthenticated, function(req, res, next) {
// 	console.log("req.user\n", req.user)
// 	User.findOne({ _id: req.user._id }).exec((err, user) => {
// 		// Currently logged in user
// 		// console.log("\nuser\n", user)

// 		res.render('user_profile', {
// 			user: user,
// 			helpers: {
//         if_eq: function(a, b, options) {
//           if (a == b) {
//             return options.fn(this);
//           } else {
//           	return options.inverse(this)
//           }
//         }
//       }
// 		})
// 	})
// });

// Get a member's profile
router.get('/:username', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.username }, (err, user) => {
		res.render('member_profile', { user: user })
	})
});

// Send a new message to another user
router.post('/messages/:user_id', ensureAuthenticated, function(req, res, next) {
	User.findById({ _id: req.params.user_id }, function(err, user) {
		// The sender
		// console.log("\nreq.user\n", req.user)

		// The user the message is being sent to
		// console.log("\nuser\n", user)

		// The message
		// console.log("\nreq.body\n", req.body)

		Conversation.create({
			created_at: Date.now()
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
						conversation.save((err, final) => {console.log("conversation\n", final)})
						message.save((err, final) => {console.log("message\n", final)})
						res.redirect('/users/member')
					}
				})
			}
		})

		// Message.create({
		// 	message: req.body.message,
		// 	from: req.user.first_name,
		// 	to: user.first_name,
		// 	from_user_id: req.user._id,
		// 	to_user_id: user._id,
		// 	created_at: Date.now()
		// }, (err, message) => {
		// 	if (err) {
		// 		console.log(err)
		// 	} else {
		// 		Conversation.create({
		// 			created_at: Date.now()
		// 		})
		// 		user.conversations.push(message)
		// 		req.user.conversations.push(message)
		// 		user.save((err, final) => {})
		// 		req.user.save((err, final) => {})
		// 		res.redirect('/users/member')
		// 	}
		// })
	})
})

// Reply to a message
router.post('/messages/reply/:from_user_id', ensureAuthenticated, function(req, res, next) {
	User.findById({ _id: req.params.from_user_id }, function(err, user) {
		// The sender
		// console.log("\nreq.user\n", req.user)

		// The user the message is being sent to
		// console.log("\nuser\n", user)

		// The message
		// console.log("\nreq.body\n", req.body)

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
				// req.user.messages.push(message)
				// req.user.save((err, final) => {console.log("\n\nreq.user.save\n" + final);})
				res.redirect('/users/member')
			}
		})
	})
});

// router.post('/messages/reply/:from_user_id', ensureAuthenticated, function(req, res, next) {
// 	User.findById({ _id: req.params.from_user_id }).populate('messages').exec((err, user) => {
// 		// The sender
// 		// console.log("\nreq.user\n", req.user)

// 		// The user the message is being sent to
// 		console.log("\nuser\n", user)

// 		// The message
// 		// console.log("\nreq.body\n", req.body)

// 		const all_messages = []
// 		user.messages.map((message_obj) => { all_messages.push(message_obj) })

// 		const groups = Object.create(null)

// 		all_messages.forEach((message, index) => {
// 			groups[message.to_user_id] = groups[message.to_user_id] || []
// 			groups[message.to_user_id].push(message)
// 		})

// 		const result = Object.keys(groups).map((k) => {
// 			const temp = {}
// 			temp[k] = groups[k]
// 			return temp
// 		})

// 		console.log("\nresult\n", result)

// 		// Message.create({
// 		// 	message: req.body.message,
// 		// 	from: req.user.first_name,
// 		// 	to: user.first_name,
// 		// 	from_user_id: req.user._id,
// 		// 	to_user_id: user._id,
// 		// 	created_at: Date.now()
// 		// }, (err, message) => {
// 		// 	if (err) {
// 		// 		console.log(err)
// 		// 	} else {
// 		// 		user.messages.push(message)
// 		// 		user.save((err, final) => {console.log("user.save\n" + final);})
// 		// 		req.user.messages.push(message)
// 		// 		req.user.save((err, final) => {console.log("\n\nreq.user.save\n" + final);})
// 		// 		res.redirect('/users/member')
// 		// 	}
// 		// })
// 	})
// });

module.exports = router;

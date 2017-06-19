var mongoose = require('mongoose');

var Conversation = mongoose.Schema({
	created_at: Date,
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Messages'
		}
	],
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]

});

var Conversation = module.exports = mongoose.model('Conversations', Conversation);

// var Conversation = mongoose.Schema({
// 	from: {
// 		type: String,
// 		required: true
// 	},
// 	to: {
// 		type: String,
// 		required: true
// 	},
// 	from_user_id: {
// 		type: String,
// 		required: true
// 	},
// 	to_user_id: {
// 		type: String,
// 		required: true
// 	},
// 	created_at: {
// 		type: Date
// 	},
// 	users: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: 'User'
// 		}
// 	]
// });
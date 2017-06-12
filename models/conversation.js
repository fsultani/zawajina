var mongoose = require('mongoose');

// Define the Message schema - method 1
var Conversation = mongoose.Schema({
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	from_user_id: {
		type: String,
		required: true
	},
	to_user_id: {
		type: String,
		required: true
	},
	created_at: {
		type: Date
	},
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Messages'
		}
	]
});

// Create the model for the database
// In the database, the collection is named 'messages'
module.exports = mongoose.model('Conversations', Conversation);
// var Message = module.exports = mongoose.model('Messages', Message);
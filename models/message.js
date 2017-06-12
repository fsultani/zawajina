var mongoose = require('mongoose');

// Define the Message schema - method 1
var Message = mongoose.Schema({
	message: {
		type: String,
		required: true
	},
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
	conversations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversations'
		}
	]
});

// Create the model for the database
// In the database, the collection is named 'messages'
module.exports = mongoose.model('Messages', Message);
// var Message = module.exports = mongoose.model('Messages', Message);
var mongoose = require('mongoose');

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
	created_at: Date,
	unread: Boolean,
	conversations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversations'
		}
	]
});

module.exports = mongoose.model('Messages', Message);
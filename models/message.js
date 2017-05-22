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
	username_from: {
		type: String,
		required: true
	},
	username_to: {
		type: String,
		required: true
	}
});

// Create the model for the database
// In the database, the collection is named 'messages'
var Message = module.exports = mongoose.model('Messages', Message);
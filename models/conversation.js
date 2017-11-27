var mongoose = require('mongoose');

var Conversation = mongoose.Schema({
  created_at: Date,
  updated_at: Date,
  created_by: String,
  created_by_username: String,
  created_by_user_id: String,
  sent_to: String,
  sent_to_username: String,
  sent_to_user_id: String,
  unread: Boolean,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  ]

});

var Conversation = module.exports = mongoose.model('Conversations', Conversation);
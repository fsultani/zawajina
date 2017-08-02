var mongoose = require('mongoose');

var Conversation = mongoose.Schema({
  created_at: Date,
  created_by_user_name: String,
  created_by_user_id: String,
  sent_to_user_name: String,
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
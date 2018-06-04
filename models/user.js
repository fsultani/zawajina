var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var User = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },
  birthMonth: {
    type: String,
    required: true
  },
  birthDate: {
    type: Number,
    required: true
  },
  birthYear: {
    type: Number,
    required: true
  },
  profilePicture: {
    type: String
  }
});

var User = module.exports = mongoose.model('Users', User);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          newUser.password = hash;
          newUser.save(callback);
      });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) console.log(err)
      callback(null, isMatch);
  });
}

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var User = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userPassword: {
    type: String,
    required: true
  },
});

var User = module.exports = mongoose.model('Users', User);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save(callback);
      });
  });
}

module.exports.getUserByEmail = (email, callback) => {
  User.findOne({ email }, callback);
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) console.log(err)
      callback(null, isMatch);
  });
}

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

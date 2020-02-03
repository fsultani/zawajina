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
  startedRegistration: {
    type: Boolean,
    required: true,
  },
  completedRegistration: {
    type: Boolean,
    required: true,
  },
  fullDob: {
    type: String,
    required: () => (
      typeof this.fullDob === undefined || (this.fullDob !== undefined && typeof this.fullDob !== 'string')
    )
  },
  userAge: {
    type: Number,
    required: () => (
      typeof this.userAge === undefined || (this.userAge !== undefined && typeof this.userAge !== 'string')
    )
  },
  gender: {
    type: String,
    required: () => (
      typeof this.gender === undefined || (this.gender !== undefined && typeof this.gender !== 'string')
    )
  },
  country: {
    type: String,
    required: () => (
      typeof this.country === undefined || (this.country !== undefined && typeof this.country !== 'string')
    )
  },
  state: {
    type: String,
    default: undefined,
    required: false,
  },
  city: {
    type: String,
    required: () => (
      typeof this.city === undefined || (this.city !== undefined && typeof this.city !== 'string')
    )
  },
  isUserSessionValid: {
    type: Boolean,
    required: true,
  },
});

var User = module.exports = mongoose.model('Users', User);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.userPassword, salt, (err, hash) => {
          newUser.userPassword = hash;
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

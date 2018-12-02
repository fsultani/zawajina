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
    required: function() {
      return typeof this.gender === null || (this.gender !== null && typeof this.gender !== 'string')
    }
  },
  age: {
    type: Number,
    required: function() {
      return typeof this.age === null || (this.age !== null && typeof this.age !== 'string')
    }
  },
  country: {
    type: String,
    required: function() {
      return typeof this.country === null || (this.country !== null && typeof this.country !== 'string')
    }
  },
  state: {
    type: String,
    default: null,
    required: false,
  },
  city: {
    type: String,
    required: function() {
      return typeof this.city === null || (this.city !== null && typeof this.city !== 'string')
    }
  },
  ethnicity: {
    type: String,
    required: function() {
      return typeof this.ethnicity === null || (this.ethnicity !== null && typeof this.ethnicity !== 'string')
    }
  },
  profession: {
    type: String,
    required: function() {
      return typeof this.profession === null || (this.profession !== null && typeof this.profession !== 'string')
    }
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

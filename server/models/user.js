var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
      required: () =>
        typeof this.fullDob === undefined ||
        (this.fullDob !== undefined && typeof this.fullDob !== 'string'),
    },
    age: {
      type: Number,
      required: () =>
        typeof this.userAge === undefined ||
        (this.userAge !== undefined && typeof this.userAge !== 'string'),
    },
    gender: {
      type: String,
      required: () =>
        typeof this.gender === undefined ||
        (this.gender !== undefined && typeof this.gender !== 'string'),
    },
    country: {
      type: String,
      required: () =>
        typeof this.country === undefined ||
        (this.country !== undefined && typeof this.country !== 'string'),
    },
    state: {
      type: String,
      default: undefined,
      required: false,
    },
    city: {
      type: String,
      required: () =>
        typeof this.city === undefined ||
        (this.city !== undefined && typeof this.city !== 'string'),
    },
    ethnicity: {
      type: Array,
      required: () =>
        typeof this.ethnicity === undefined ||
        (this.ethnicity !== undefined && typeof this.ethnicity !== 'object'),
    },
    isUserSessionValid: {
      type: Boolean,
      required: true,
    },
    photos: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const User = (module.exports = mongoose.model('Users', UserSchema));

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByEmail = (email, callback) => {
  User.findOne({ email }, callback);
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (userPassword, hash, callback) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, hash, (err, isMatch) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(isMatch);
    });
  });

const bcrypt = require('bcryptjs');

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

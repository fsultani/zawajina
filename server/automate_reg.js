var mongoose = require('mongoose')
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://farid:farid@ds161901.mlab.com:61901/my_match')

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
  from_user_id: {
    type: String,
    required: true
  },
  to_user_id: {
    type: String,
    required: true
  }
});

var Message = module.exports = mongoose.model('Messages', Message);

var UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
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
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

let times = (n, f) => {
  while(n-- > 0) f(n)
}

n = 10
times(n, (n) => {
  User.create({
    first_name: `Farid ${n}`,
    last_name: `Sultani ${n}`,
    username: `fsultani${n}`,
    email: `farid_${n}@gmail.com`,
    password: 'asdf',
    gender: 'male'
  }, (err, user) => {
    if (err) {
      return next(err)
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            user.save((err, data) => {});
        });
      });
    }
  })
})

times(n, (n) => {
  User.create({
    first_name: `Sadia ${n}`,
    last_name: `Agha ${n}`,
    username: `sadia${n}`,
    email: `sadia_${n}@gmail.com`,
    password: 'asdf',
    gender: 'female'
  }, (err, user) => {
    if (err) {
      return next(err)
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            user.save((err, data) => {});
        });
      });
    }
  })
})

// times(10, (n) => {
//  User.create({
//    first_name: `Farid ${n}`,
//    last_name: `Sultani ${n}`,
//    username: `fsultani ${n}`,
//    email: `farid_${n}@gmail.com`,
//    password: `${Math.floor(Math.random() * 10000000)}`,
//  }, (err, user) => {
//    err ? console.log(err) : (
//      Message.create({
//        message: "This is a test",
//        from: "Farid",
//        from_user_id: "12345",
//        to_user_id: "67890"
//      }, (err, message) => {
//        err ? console.log(err) : (
//            user.messages.push(message),
//            user.save((err, final) => {})
//          )
//      })
//    )
//  })
// })
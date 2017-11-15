const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Cookies = require('js-cookie');
const path = require('path');

const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown user'});
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      })
    })
  }
));

router.get('/register', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.get('/home', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.get('/profile', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.get('/profile-info', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedToken = jwt.decode(token, JWT_SECRET)
  User.find({ username: decodedToken.username}, (err, member) => {
    res.json({ member: member[0] })
  })
})

router.get('/all-members', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedToken = jwt.decode(token, JWT_SECRET)
  User.findOne({username: decodedToken.username}, (err, user) => {
    if (!user) {
      console.log("Authentication failed. User not found.")
      return res.status(403).send("Authentication failed. User not found.")
    } else {
      User.find({gender: 'female'}, (err, all) => {
        res.json({all: all})
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.json(401, { error: 'message' })
    } else {
      const token = jwt.encode({ username: user.username}, JWT_SECRET)
      // Return a token to the client once the user is authenticated
      Cookies.set('token', token)
      res.json({ token: token })
    }
  })(req, res, next)
})

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

/****************************************************************************************************
// GET home page.
****************************************************************************************************/
// router.get('/home', passport.authenticate('jwt', { session: false}), function(req, res, next) {
//   if (req.user.gender == 'male') {
//     User.find({gender: 'female'}, function(err, all) {
//       // console.log("all\n", all)
//       if (err) return next(err)
//       else {
//         Conversation.find({ users: req.user._id }, (err, total_conversations_count) => {

//           Message.find({to_user_id: req.user._id}, (err, messages) => {

//             function find_unread_messages(message) {
//               return ((req.user._id.toString() === message.to_user_id ) && message.unread)
//             }

//             if (messages.some(find_unread_messages)) {
//               // console.log("find_unread_messages is true")

//               var conversations_count = 0
//               total_conversations_count.map((each_conversation) => {
//                 if ((req.user._id.toString() === each_conversation.sent_to_user_id) || (req.user._id.toString() === each_conversation.created_by_user_id) && each_conversation.unread) {
//                   conversations_count += 1
//                 }
//               })
//               res.render('home', {
//                 conversations_count: conversations_count,
//                 all: all
//               })
//             } else {
//               // console.log("Both are false")
//               res.render('home', {
//                 all: all
//               })
//             }
//           })
//         })
//       }
//     })
//   } else {
//     User.find({gender: 'male'}, function(err, all) {
//       if (err) return next(err)
//       else {
//         Conversation.find({ users: req.user._id }, (err, total_conversations_count) => {

//           Message.find({to_user_id: req.user._id}, (err, messages) => {
//             // console.log('messages\n', messages)

//             function find_unread_messages(message) {
//               return ((req.user._id.toString() === message.to_user_id ) && message.unread)
//             }

//             if (messages.some(find_unread_messages)) {
//               console.log("find_unread_messages is true")

//               var conversations_count = 0
//               total_conversations_count.map((each_conversation) => {
//                 if ((req.user._id.toString() === each_conversation.sent_to_user_id) || (req.user._id.toString() === each_conversation.created_by_user_id) && each_conversation.unread) {
//                   conversations_count += 1
//                 }
//               })
//               res.render('home', {
//                 conversations_count: conversations_count,
//                 all: all
//               })
//             } else {
//               res.render('home', {
//                 all: all
//               })
//             }
//           })
//         })
//       }
//     })
//   }
// });

router.post('/register', function(req, res) {
  var first_name = req.body.first_name
  var last_name = req.body.last_name
  var username = req.body.username
  var email = req.body.email
  var password = req.body.password
  var confirm_password = req.body.confirm_password
  var gender = req.body.gender
  
  req.checkBody('first_name', 'First name is required').notEmpty()
  req.checkBody('last_name', 'Last name is required').notEmpty()
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('confirm_password', 'Password confirmation is required').notEmpty()
  req.checkBody('gender', 'Please select your gender').notEmpty()
  
  var errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    if (password === confirm_password) {
      var newUser = new User ({
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
        gender: gender
      })

      User.createUser(newUser, (err, user) => {})
    
      req.flash('success_message', 'You are registered and can now log in!');
      res.redirect('/login');
    } else {
      req.flash('error_message', 'Your passwords did not match.  Please try again.');
      res.redirect('/register')
    }
  }
})

module.exports = router

/* GET root page. */
// router.get('/', function(req, res, next) {
//   console.log("authenticating")
//   if(req.isAuthenticated()){
//     return res.redirect('/home');
//     next();
//   } else {
//     res.redirect('/login')
//   }
// });

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true,
// }));

// passport.use(new LocalStrategy(
//   function(username, done) {
//     User.getUserByUsername(username, function(err, user) {
//       if (err) throw err;
//       if (!user) {
//         return done(null, false, {message: 'Unknown user'});
//       } else {
//         done(null, user);
//       }
//     })
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.getUserById(id, function(err, user) {
//     done(err, user);
//   });
// });

// router.post('/login', (req, res) => {
//   User.find({username: req.body.username}, (err, user) => {
//     if (err) return next(err)
//     if (!user) {
//       res.send({ success: false, msg: 'Authentication failed.  User not found.'})
//     } else {
//       User.comparePassword(req.body.password, user[0].password, (err, isMatch) => {
//         if (isMatch && !err) {
//           var token = jwt.encode(user, JWT_SECRET)
//           res.json({ success: true, token: token })
//         } else {
//           res.send({ success: false, msg: 'Authentication failed.  Wrong password.'})
//         }
//       })
//     }
//   })
// })
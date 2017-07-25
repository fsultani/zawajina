var express = require('express')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')

var JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

var router = express.Router()

var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

/* GET root page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    return res.redirect('/home');
    next();
  } else {
    res.redirect('/login')
  }
});

/* GET home page. */
router.get('/home', ensureAuthenticated, function(req, res, next) {
  if (req.user.gender == 'male') {
    User.find({gender: 'female'}, function(err, all) {
      if (err) return next(err)
      else {
        Conversation.find({ users: req.user._id }, (err, total_conversations_count) => {

          Message.find({to_user_id: req.user._id}, (err, messages) => {
            console.log('messages\n', messages)

            function find_unread_messages_2(message) {
              return ((req.user._id.toString() === message.to_user_id ) && message.unread)
            }

            if (messages.some(find_unread_messages_2)) {
              console.log("find_unread_messages_2 is true")

              var conversations_count = 0
              total_conversations_count.map((each_conversation) => {
                if ((req.user._id.toString() === each_conversation.sent_to_user_id) || (req.user._id.toString() === each_conversation.created_by_user_id) && each_conversation.unread) {
                  conversations_count += 1
                }
              })
              res.render('home', {
                conversations_count: conversations_count,
                all: all
              })
            } else {
              console.log("Both are false")
              res.render('home', {
                all: all
              })
            }
          })
        })
      }
    })
  } else {
    User.find({gender: 'female'}, function(err, all) {
      if (err) return next(err)
      else {
        Conversation.find({ users: req.user._id }, (err, total_conversations_count) => {

          Message.find({to_user_id: req.user._id}, (err, messages) => {
            console.log('messages\n', messages)

            function find_unread_messages_2(message) {
              return ((req.user._id.toString() === message.to_user_id ) && message.unread)
            }

            if (messages.some(find_unread_messages_2)) {
              console.log("find_unread_messages_2 is true")

              var conversations_count = 0
              total_conversations_count.map((each_conversation) => {
                if ((req.user._id.toString() === each_conversation.sent_to_user_id) || (req.user._id.toString() === each_conversation.created_by_user_id) && each_conversation.unread) {
                  conversations_count += 1
                }
              })
              res.render('home', {
                conversations_count: conversations_count,
                all: all
              })
            } else {
              res.render('home', {
                all: all
              })
            }
          })
        })
      }
    })
  }
});

router.get('/register', function(req, res, next) {
  res.render('register')
});

router.get('/login', function(req, res, next) {
  res.render('login')
});

router.get('/logout', function(req, res, next) {
  req.logout()
  req.flash('logged_out_message', 'You have successfully logged out.');
  res.redirect('/login')
});

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

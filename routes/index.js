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

router.get('/api/profile-info', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.find({ username: decodedUser.username}, (err, member) => {
    res.json({ member: member[0] })
  })
})

router.get('/api/all-members', (req, res, next) => {
  const token = req.headers['user-cookie']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOne({username: decodedUser.username}, (err, user) => {
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

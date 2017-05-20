var express = require('express')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')

// var JWT_SECRET = 'fsultani'
var JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

var router = express.Router()

var User = require('../models/user')

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

/* GET root page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	res.render('home')
});

/* GET home page. */
router.get('/home', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.user.username }, function(err, user) {
		if (err) throw err
		else {
			User.find(function(err, all) {
				if (err) throw err
				else {
					res.render('home', {
						user: user,
						allUsers: all
					})
				}
			})
		}
	})
});

router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.user.username }, function(err, user) {
		if (err) throw err
		else {
			res.render('dashboard', {
				user: user
			})
		}
	})
});

router.get('/register', function(req, res, next) {
  res.render('register')
});

// helpers: {
//   is: function(a, b, options) {
//     if (a == b) {
//       return options.fn(this);
//     }
//   }
// }

// router.get('/user/:username', ensureAuthenticated, function(req, res, next) {
// 	console.log("User that's logged in:", req.user)
// 	User.findOne({ username: req.params.username }, function(err, user) {
// 		console.log("User being viewed:", user)
// 		if (err) throw err
// 		else {
// 			if (req.user.username == user.username) {
// 				data = {
// 					logged_in: req.user,
// 					current_user: req.user
// 				}
// 			} else {
// 				data = {
// 					logged_in: user,
// 					other_user: user
// 				}
// 			}
// 			res.render('profile', data)
// 		}
// 	})
// });

router.get('/user/:username', ensureAuthenticated, function(req, res, next) {
	console.log("User that's logged in:", req.user)
	User.findOne({ username: req.params.username }, function(err, user) {
		console.log("User being viewed:", user)
		if (err) throw err
		else {
			if (req.user.username == user.username) {
				res.render('profile', {
					user: req.user
				})
			} else {
				res.render('member_profile', {
					user: user
				})
			}
		}
	})
});

router.get('/login', function(req, res, next) {
  res.render('login')
});

router.get('/logout', function(req, res, next) {
	req.logout()
	res.render('logout')
});

router.post('/register', function(req, res) {
	var first_name = req.body.first_name
	var last_name = req.body.last_name
	var username = req.body.username
	var email = req.body.email
	var password = req.body.password
	var confirm_password = req.body.confirm_password
	
	req.checkBody('first_name', 'First name is required').notEmpty()
	req.checkBody('last_name', 'Last name is required').notEmpty()
	req.checkBody('username', 'Username is required').notEmpty()
	req.checkBody('email', 'Email is required').notEmpty()
	req.checkBody('password', 'Password is required').notEmpty()
	req.checkBody('confirm_password', 'Password confirmation is required').notEmpty()
	
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
				password: password
			})

			User.createUser(newUser, function(err, user) {})
		
			req.flash('success_message', 'You are registered and can now log in!');
			res.redirect('/login');
		} else {
			req.flash('error_message', 'Your passwords did not match.  Please try again.');
			res.redirect('/register')
		}
	}
})

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
  	successRedirect: '/home',
  	failureRedirect: '/login',
  	failureFlash: true,
}));

// router.post('/login', function(req, res) {
// 	// Password is not encrypted here
// 	// console.log('req.body')
// 	// console.log(req.body)
	
// 	User.findOne({ username: req.body.username }, function(err, user) {
// 		// Password is encrypted here
// 		if (err) throw err
// 		// console.log('user')
// 		// console.log(user)

// 		bcrypt.compare(req.body.password, user.password, function(err, result) {
// 			if (result) {
// 				var token = jwt.encode(user, JWT_SECRET)
// 				// return res.status(200).send({ user: user, token: token })
// 				return res.redirect('/user/' + user.username)
// 			} else {
// 				return res.status(401).send({error: "Something is wrong."})
// 			}
// 		})
// 	})
// })

module.exports = router
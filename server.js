const http = require('http')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const osascript = require('node-osascript');

const flash = require('connect-flash')
const mongo = require('mongodb')
const mongoose = require('mongoose')

if (process.env.NODE_ENV === 'mlab-dev') {
  // require('./db_credentials')
  mongoose.connect('mongodb://farid:farid@ds139322.mlab.com:39322/my_match_dev')
  console.log("Using mlab:", process.env.NODE_ENV)
} else if (process.env.NODE_ENV === 'local') {
  require('./db_credentials')
  mongoose.connect(process.env.LOCAL)
  console.log("Using local db - mongodb://localhost/my_match_local_dev")
} else {
  mongoose.connect(process.env.HEROKU)
  console.log("Heroku deployment")
}

const app = express()

const index = require('./routes/index')
const registerRoute = require('./routes/registerRoute')
const users = require('./routes/users')
const conversation = require('./routes/conversation')
const messages = require('./routes/messages')

const Conversation = require('./models/conversation')

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Express Session
// app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: "farid's secret",
  resave: true,
  saveUninitialized: true,
}))

// Set static folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// Catch all 'get' requests, and respond with public/index.html
app.get('*', (req, res, next) => {
  if (req.url === '/') {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'))
  } else if (req.url === '/login') {
    res.sendFile(path.join(__dirname, 'public/pages/login.html'))
  } else if (req.url === '/about') {
    res.sendFile(path.join(__dirname, 'public/pages/about.html'))
  } else if (req.url === '/registration/student') {
    res.sendFile(path.join(__dirname, 'public/pages/registration-student.html'))
  } else if (req.url === '/registration/tutor') {
    res.sendFile(path.join(__dirname, 'public/pages/tutorRegistration/registration-tutor.html'))
  } else if (req.url.indexOf('/api/') === -1) {
    res.sendFile(path.join(__dirname, 'public/router.html'))
  } else if (req.url === '/static/favicon.ico') {
    res.status(204)
  }
  return next()
})

// Passport init
// app.use(passport.initialize())
// app.use(passport.session())

// Express Validator
// app.use(express.json())

// Connect Flash
// app.use(flash())

// app.use(function (req, res, next) {
//   res.locals.success_message = req.flash('success_message')
//   res.locals.error_message = req.flash('error_message')
//   res.locals.error = req.flash('error')
//   res.locals.logged_out_message = req.flash('logged_out_message')
//   res.locals.logged_in_user = req.user
//   next()
// })

// Use index.js for any routes beginning with '/'
app.use('/', index)
app.use('/register', registerRoute)
app.use('/users', users)
app.use('/conversation', conversation)
app.use('/messages', messages)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404;
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
})

const port = process.env.PORT || 3000;

// Reload the app on every file change
osascript.execute(
  `
  tell application "Google Chrome"
    set current_site to URL of active tab of front window
    if current_site contains ("http://localhost:3000") then
      reload active tab of front window
    end if
  end tell

  `, (err, result, raw) => {
    if (err) return console.error(err)
    }
);

app.listen(port, () => {
  console.log("Listening on port " + port)
  if (process.send) {
    // process.send({ event:'online', url:'http://localhost:' + port})
    process.send('online');
  }
})

module.exports = app;

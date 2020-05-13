const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const osascript = require('node-osascript');
const flash = require('connect-flash');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const User = require('./models/user');

if (process.env.NODE_ENV === 'mlab-dev') {
  // require('./db_credentials')
  mongoose.connect('mongodb://farid:farid@ds139322.mlab.com:39322/my_match_dev', { useFindAndModify: false });
  console.log("Using mlab:", process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'local') {
  require('./db_credentials');
  mongoose.connect(process.env.LOCAL, { useFindAndModify: false });
  console.log("Using local db - mongodb://localhost/my_match_local_dev")
} else {
  mongoose.connect(process.env.HEROKU, { useFindAndModify: false });
  console.log("Heroku deployment");
}

const app = express();

const index = require('./routes/index');
const registerRoute = require('./routes/registerRoute');
const users = require('./routes/users');
const conversation = require('./routes/conversation');
const messages = require('./routes/messages');

const Conversation = require('./models/conversation');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set static folder
app.use('/static', express.static(path.join(__dirname, '../../tutor')));

// Catch all GET requests, and respond with an html file
app.get('*', (req, res, next) => {
  const { token } = req.cookies;
  if (token && req.url.indexOf('/api/') === -1) {
    res.sendFile(path.join(__dirname, '../client/app/router.html'));
  } else {
    if (req.url.indexOf('/api/') === -1) {
      switch(req.url) {
        case '/':
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/home/index.html'));
          break;
        case '/login':
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/login/index.html'));
          break;
        case '/about':
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/about/index.html'));
          break;
        case '/signup':
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/signup/step1/index.html'));
          break;
        case '/signup/profile':
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/signup/step2/index.html'));
          break;
        default:
          res.sendFile(path.join(__dirname, '../client/landing-page/pages/home/index.html'));
      }
    } else {
      return next();
    }
  }
})

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

// require('./config/auth');

// Use index.js for any routes beginning with '/'
app.use('/', index);
app.use('/register', registerRoute);
app.use('/users', users);
app.use('/conversation', conversation);
app.use('/messages', messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404;
  next(err)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
})

const port = process.env.PORT || 3000;

// Reload the app on every file change
osascript.execute(
  `
  tell application "Google Chrome"
    set current_site to URL of active tab of front window
    if current_site contains ("localhost") then
      reload active tab of front window
    end if
  end tell
  tell application "Safari"
    set current_site to URL of document 1
    if current_site contains ("localhost") then
      tell window 1
        do JavaScript "window.location.reload(true)" in current tab
      end tell
    end if
  end tell

  `, (err, result, raw) => {
    if (err) return console.error(err)
    }
);

app.listen(port, () => {
  if (process.send) {
    // process.send({ event:'online', url:'http://localhost:' + port})
    process.send('online');
    console.log(`Listening on port ${port}`);
  }
})

module.exports = app;

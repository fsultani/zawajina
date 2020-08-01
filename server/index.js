const http = require('http');
const express = require('express');
const expressHandlebars  = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const osascript = require('node-osascript');
const flash = require('connect-flash');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
const authenticateToken = require('./config/auth');

if (process.env.NODE_ENV === 'mlab-dev') {
  // require('./db_credentials')
  // mongoose.connect('mongodb://farid:farid@ds139322.mlab.com:39322/my_match_dev', { useFindAndModify: false });
  mongoose.connect('mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority', { useFindAndModify: false });
  console.log("Using mlab:", process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'local') {
  require('./db_credentials');
  mongoose.connect(process.env.LOCAL, { useFindAndModify: false });
  console.log("Using local db - mongodb://localhost/my_match_local_dev")
} else {
  const mongodbConnect = process.env.DEVELOPMENT ?
  'mongodb://farid:farid@ds139322.mlab.com:39322/my_match_dev' :
  process.env.HEROKU;
  mongoose.connect(mongodbConnect, { useFindAndModify: false });
  // mongoose.connect('mongodb://farid:farid@ds139322.mlab.com:39322/my_match_dev', { useFindAndModify: false });
  console.log("Heroku deployment");
}

const app = express();

const index = require('./routes/index');
const registerRoute = require('./routes/registerRoute');
const user = require('./routes/user');
const conversation = require('./routes/conversation');
const messages = require('./routes/messages');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine('.hbs', expressHandlebars({
  defaultLayout: 'index',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../client/app/views/layouts')
}));
app.set('views', path.join(__dirname, '../client/app/views'));
app.set('view engine', '.hbs');

// Set static folder
app.use('/static', express.static(path.join(process.env.PWD)));

// Catch all GET requests, and respond with an html file
app.get('*', (req, res, next) => {
  const { userId, token } = req.cookies;
  if (!token && req.url.indexOf('/api/') === -1) {
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
      case '/terms':
        res.sendFile(path.join(__dirname, '../client/landing-page/pages/terms/index.html'));
        break;
      default:
        res.redirect('/login');
    }
  } else {
    if (userId) return next();
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user.userDetails;
      next();
    })
  }
})

app.get('/random', (req, res, next) => {
  const { token } = req.cookies;
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user.userDetails;
    next();
  })
});

// Use index.js for any routes beginning with '/'
app.use('/', index);
app.use('/register', registerRoute);
app.use('/user', user);
app.use('/conversation', conversation);
app.use('/messages', messages);

const port = process.env.PORT || 3000;

// Reload the app on every file change in development mode only
if (process.env.DEVELOPMENT) {
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
}

app.listen(port, () => {
  if (process.send) {
    // process.send({ event:'online', url:'http://localhost:' + port})
    process.send('online');
    console.log(`Listening on port ${port}`);
  }
})

module.exports = app;

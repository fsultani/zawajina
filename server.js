var http = require('http')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator')
var flash = require('connect-flash');
var mongo = require('mongodb')
var mongoose = require('mongoose')
require('./db_credentials')

if (process.env.NODE_ENV === 'mlab-dev') {
  mongoose.connect(process.env.MONGO_DB_MLAB_DEV)
  console.log("Using mlab:", process.env.NODE_ENV)
} else if (process.env.NODE_ENV === 'local') {
  mongoose.connect(process.env.LOCAL)
  console.log("Using local db - mongodb://localhost/my_match_local_dev")
} else {
  console.log("Heroku deployment")
  mongoose.connect(process.env.MONGO_DB)
}

var app = express();

var index = require('./routes/index');
var users = require('./routes/users');
var conversations = require('./routes/conversations');
var messages = require('./routes/messages');

var Conversation = require('./models/conversation')

// View engine setup
// Make the 'views' folder the starting point for any route that uses res.render
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', '.hbs');
// app.engine('.hbs', exphbs({defaultLayout:'index', extname: '.hbs'}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'crescent.png')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));

// Express Session
// app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: "farid's secret",
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, error_message, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      error_message: error_message,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  res.locals.logged_out_message = req.flash('logged_out_message');
  res.locals.logged_in_user = req.user
  next();
});

// Catch all 'get' requests, and respond with public/index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'))
// })

// Use index.js for any routes beginning with '/'
app.use('/', index);

app.use('/users', users);
app.use('/conversations', conversations);
app.use('/messages', messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on port " + port)
  if (process.send) {
    process.send({ event:'online', url:'http://localhost:' + port})
  }
})

module.exports = app;

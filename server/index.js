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

const mongodbConnect = process.env.DEVELOPMENT ? 'mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority' : process.env.MONGODB_URI;
mongoose.connect(mongodbConnect);

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

// Set static folder
app.use('/static', express.static(path.join(process.env.PWD)));

app.engine('.hbs', expressHandlebars({
  defaultLayout: 'app/app',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../client/views/layouts')
}));
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', '.hbs');

// Catch all GET requests, and respond with an html file
app.get('*', (req, res, next) => {
  const { userId, token } = req.cookies;
  if (!token && req.url.indexOf('/api/') === -1) {
    switch(req.url) {
      case '/':
        res.render('landing-pages/home/home', {
          layout: 'landing-pages/index',
          title: 'My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/home/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal',
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        })
        break;
      case '/about' || 'about':
        res.render('landing-pages/about/about', {
          layout: 'landing-pages/index',
          title: 'About Us - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/about/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        })
        break;
      case '/login':
        res.render('landing-pages/login/login', {
          layout: 'landing-pages/index',
          title: 'Login - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/login/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/login/handleFocusEvent.js',
            '/static/client/views/landing-pages/login/handleLogin.js',
          ],
          divContainerClasses: 'login-page-container',
        })
        break;
      case '/signup':
        res.render('landing-pages/signup/signup', {
          layout: 'landing-pages/index',
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/signup/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/signup/js/includeHTML.js',
            '/static/client/views/landing-pages/signup/js/togglePassword.js',
            '/static/client/views/landing-pages/signup/js/handleSignupStepOne.js',
          ],
          divContainerClasses: 'signup-container',
        })
        break;
      case '/signup/profile':
        res.render('landing-pages/signup-profile/signup-profile', {
          layout: 'landing-pages/index',
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/signup-profile/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/signup-profile/js/signupProfileInit.js',
            '/static/client/views/landing-pages/signup-profile/js/handleCreateNewAccount.js',
            '/static/client/views/landing-pages/signup-profile/js/imageUpload.js',
          ],
          bodyClasses: 'overlay',
          divContainerClasses: 'signup-container',
        })
        break;
      case '/terms':
        res.render('landing-pages/terms/terms', {
          layout: 'landing-pages/index',
          title: 'Terms of Service - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/layouts/landing-pages/global-styles.css',
            '/static/client/views/partials/styles/landing-page-nav.css',
            '/static/client/views/partials/styles/footer.css',
            '/static/client/views/landing-pages/terms/styles.css',
          ],
        })
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
require('dotenv').config();
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const path = require('path');
const cookieParser = require('cookie-parser');
const osascript = require('node-osascript');

const { connectToServer } = require('./db.js');
const { checkAuthentication } = require('./middleware/checkAuthentication');
const {
  register,
  likes,
  authSessionLogin,
  authSessionLogout,
  password,
  passwordApi,
  profile,
  users,
  user,
  userApi,
  search,
  messages,
  settings,
  settingsAccountApi,
  settingsPasswordApi,
} = require('./routes/index');

const {
  aboutPage,
  indexPage,
  loginPage,
  resendEmailPage,
  signupPage,
  signupProfilePage,
  termsPage,
  verifyEmailPage,
} = require('./views/index');

const app = express();

app.use(express.json());
app.use(cookieParser());

/* Set static folder */
app.use('/static', express.static(path.join(process.env.PWD)));

app.engine('html', es6Renderer);
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'html');

app.use((_req, _res, next) => {
  connectToServer((err, _) => {
    if (err) throw err;
    next();
  });
});

/* Public APIs */
app.use('/api/auth-session/login', authSessionLogin);
app.use('/password', password);
app.use('/api/password', passwordApi);
app.use('/api/register', register);

/* Private APIs */
app.use('/likes', checkAuthentication, likes);
app.use('/likes-me', checkAuthentication, likes);
app.use('/api/auth-session/logout', checkAuthentication, authSessionLogout);
app.use('/messages', checkAuthentication, messages);
app.use('/search', checkAuthentication, search);
app.use('/settings', checkAuthentication, settings);
app.use('/api/settings/account', checkAuthentication, settingsAccountApi);
app.use('/api/settings/password', checkAuthentication, settingsPasswordApi);
app.use('/user', checkAuthentication, user);
app.use('/profile', checkAuthentication, profile);
app.use('/api/user', checkAuthentication, userApi);
app.use('/users', checkAuthentication, users);

/* Catch all public GET requests, and respond with an html file */
app.get('*', (req, res, next) => {
  const requestUrl = req.originalUrl;

  // my_match_userId is to check for a user that lands on a public page without an ID
  // my_match_authToken is to redirect an authenticated user that visited an invalid route
  const { my_match_userId, my_match_authToken } = req.cookies;

  switch (requestUrl) {
    case '/':
      indexPage(res);
      break;
    case '/about':
      aboutPage(res);
      break;
    case '/login':
      loginPage(res);
      break;
    case '/signup':
      signupPage(res);
      break;
    case '/verify-email':
      /* If a visitor lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      verifyEmailPage(res);
      break;
    case '/resend-email':
      /* If a visitor lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      resendEmailPage(res);
      break;
    case '/signup/profile':
      /* If a visitor lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      signupProfilePage(res);
      break;
    case '/terms':
      termsPage(res);
      break;
    default:
      if (!my_match_authToken) return res.redirect('/login');
      next();
  }
});

/* Redirect to the main view for any non-matching routes where a valid my_match_authToken exists */
app.use('/*', checkAuthentication, (_, res) => res.redirect('/users'));

const port = process.env.PORT || 3000;

/* Reload the app on every file change in development mode only */
if (process.env.NODE_ENV === 'development') {
  osascript.execute(
    `
    tell application "Safari"
			# activate
      set current_site to URL of document 1
      if current_site contains ("localhost") then
        tell window 1
          do JavaScript "window.location.reload(true)" in current tab
        end tell
      end if
    end tell

    # tell application "Firefox"
    # 	activate
    # end tell

    # tell application "System Events"
    # 	tell process "Firefox"
    # 		keystroke "r" using {command down}
    # 	end tell
    # end tell

    tell application "Google Chrome"
			# activate
      set current_site to URL of active tab of front window
      if current_site contains ("localhost") then
        reload active tab of front window
      end if
    end tell

    tell application "iTerm"
			# activate
    end tell

    tell application "Visual Studio Code"
      if it is running then
				# activate
      end if
    end tell
    `,
    (err, _result, _raw) => {
      if (err) return console.log(`err - server/index.js:149\n`, err);
    }
  );
};

app.listen(port, () => {
  if (process.send) {
    process.send('online');
    console.log(`Listening on port ${port}`);
  }
});

module.exports = app;

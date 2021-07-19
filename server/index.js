const http = require('http');
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const path = require('path');
const cookieParser = require('cookie-parser');
const osascript = require('node-osascript');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { connectToServer, usersCollection, messagesCollection } = require('./db.js');
const index = require('./routes/index');
const register = require('./routes/register/index');
const user = require('./routes/user');
const search = require('./routes/search');
const messages = require('./routes/messages');

const app = express();

app.use(express.json());
app.use(cookieParser());

/* Set static folder */
app.use('/static', express.static(path.join(process.env.PWD)));

app.engine('html', es6Renderer);
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'html');

app.use((req, res, next) => {
  connectToServer(err => {
    if (err) throw err;
    next();
  });
});

/* Catch all GET requests, and respond with an html file */
app.get('*', (req, res, next) => {
  const requestUrl = req.originalUrl
  const {
    my_match_userId,
    my_match_authToken
  } = req.cookies;

  if (requestUrl.split('/').indexOf('api') !== -1 || my_match_authToken) {
    return next();
  }
  switch (requestUrl) {
    case '/':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/home/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal',
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/home/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/about':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'About Us - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/about/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/about/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/login':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Login - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/login/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/login/handleFocusEvent.js',
            '/static/client/views/landing-pages/login/handleLogin.js',
            '/static/client/views/landing-pages/login/init.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/login/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/signup':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/signup/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/signup/js/includeHTML.js',
            '/static/client/views/landing-pages/signup/js/togglePassword.js',
            '/static/client/views/landing-pages/signup/js/handleSignupStepOne.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/signup/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/verify-email':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/verify-email/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/verify-email/init.js',
            '/static/client/views/landing-pages/verify-email/handleVerityEmail.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/verify-email/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/resend-email':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/resend-email/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/resend-email/js/includeHTML.js',
            '/static/client/views/landing-pages/resend-email/js/handleResendVerificationCode.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/resend-email/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/signup/profile':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/signup-profile/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/utils.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/dobHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/locationHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/raisedHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/ethnicityHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/professionHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/languageHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/hobbiesHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/signupProfileInit.js',
            '/static/client/views/landing-pages/signup-profile/js/handleCreateNewAccount.js',
            '/static/client/views/landing-pages/signup-profile/js/imageUpload.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/signup-profile/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/terms':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Terms of Service - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/terms/styles.css',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/terms/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    default:
      res.redirect('/login');
  }
});

app.use('*', (req, res, next) => {
  const requestUrl = req.originalUrl.split('/')
  const { my_match_authToken } = req.cookies;

  if (!my_match_authToken &&
    (
      requestUrl.indexOf('signup-user-first-name') !== -1 ||
      requestUrl.indexOf('login') !== -1 ||
      requestUrl.indexOf('api') !== -1
    )
  ) return next();

  return jwt.verify(my_match_authToken, JWT_SECRET, async (authError, authUser) => {
    if (authError) {
      return res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Login - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/login/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/login/handleFocusEvent.js',
            '/static/client/views/landing-pages/login/handleLogin.js',
            '/static/client/views/landing-pages/login/init.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/login/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
    }

    usersCollection().findOne({ _id: ObjectId(authUser.my_match_userId) }, async (error, user) => {
      if (error || !user) {
        return res.render('landing-pages/_layouts/index', {
          locals: {
            title: 'Login - My Match',
            styles: [
              'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
              'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
              '/static/client/views/landing-pages/_layouts/global-styles.css',
              '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
              '/static/client/views/landing-pages/_partials/styles/footer.css',
              '/static/client/views/landing-pages/login/styles.css',
            ],
            scripts: [
              'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
              'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
              '/static/client/views/landing-pages/login/handleFocusEvent.js',
              '/static/client/views/landing-pages/login/handleLogin.js',
              '/static/client/views/landing-pages/login/init.js',
            ],
          },
          partials: {
            nav: 'landing-pages/_partials/landing-page-nav',
            body: 'landing-pages/login/index',
            footer: 'landing-pages/_partials/footer',
          },
        });
      }

      const conversationsCount = await messagesCollection().countDocuments({ createdByUserId: user._id })
      req.authUser = user;
      req.conversationsCount = conversationsCount;
      next();
    });
  });
})

/* Use index.js for any routes beginning with '/' */
app.use('/', index);
app.use('/register', register);
app.use('/user', user);
app.use('/search', search);
app.use('/messages', messages);

/* Redirect to the main view for any nonmatching routes where a valid my_match_authToken exists */
app.use('/*', (_req, res) => res.redirect('/users'));

const port = process.env.PORT || 3000;

/* Reload the app on every file change in development mode only */
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

    `,
    (err, result, raw) => {
      if (err) return console.error(err);
    }
  );
}

app.listen(port, () => {
  if (process.send) {
    process.send('online');
    console.log(`Listening on port ${port}`);
  }
});

module.exports = app;

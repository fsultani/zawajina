require('dotenv').config();
const express = require('express');
// const AdminJS = require('adminjs');
// const AdminJSExpress = require('@adminjs/express');

const es6Renderer = require('express-es6-template-engine');
const path = require('path');
const cookieParser = require('cookie-parser');
const osascript = require('node-osascript');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { connectToServer, usersCollection, messagesCollection } = require('./db.js');
const {
  register,
  login,
  password,
  users,
  user,
  search,
  messages,
  settings,
} = require('./routes/index');

const { getAllFiles } = require('./utils.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

/* Set static folder */
app.use('/static', express.static(path.join(process.env.PWD)));

app.engine('html', es6Renderer);
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'html');

let mongoDb;
app.use((_req, _res, next) => {
  connectToServer((err, db) => {
    if (err) throw err;
    mongoDb = db;
    next();
  });
});

// const adminJs = new AdminJS({
//   databases: [],
//   rootPath: '/admin',
// });

// const router = AdminJSExpress.buildRouter(adminJs);
// app.use(adminJs.options.rootPath, router); 

/* Catch all GET requests, and respond with an html file */
app.get('*', (req, res, next) => {
  const requestUrl = req.originalUrl
  const {
    my_match_userId,
    my_match_authToken
  } = req.cookies;

  if (
    requestUrl.split('/').indexOf('api') !== -1 ||
    requestUrl.indexOf('password') !== -1 ||
    my_match_authToken
  ) {
    return next();
  }

  let stylesDirectoryPath = [];
  let scriptsDirectoryPath = [];

  let styles = [];
  let scripts = [];

  switch (requestUrl) {
    case '/':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            '/static/assets/styles/fonts_googleapis.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/home/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal',
            '/static/assets/apis/axios.min.js',
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
            '/static/assets/styles/fonts_googleapis.css',
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
            '/static/assets/styles/material-design-iconic-font.min.css',
            '/static/assets/styles/bootstrap.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/login/styles.css',
          ],
          scripts: [
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/signup/styles.css',
          ],
          scripts: [
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/verify-email/styles.css',
          ],
          scripts: [
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/resend-email/styles.css',
          ],
          scripts: [
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
      stylesDirectoryPath = ['client/views/landing-pages/signup-profile'];
      scriptsDirectoryPath = ['client/views/landing-pages/signup-profile/js', 'client/views/landing-pages/signup-profile/js/helpers'];

      styles = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
        '/static/client/views/landing-pages/_layouts/global-styles.css',
        '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
        '/static/client/views/landing-pages/_partials/styles/footer.css',
      ];

      scripts = [
        '/static/assets/apis/axios.min.js',
        '/static/assets/apis/js.cookie.min.js',
      ];

      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: getAllFiles({ directoryPath: stylesDirectoryPath, fileType: 'css', filesArray: styles }),
          scripts: getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts }),
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
            '/static/assets/styles/fonts_googleapis.css',
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

app.use('*', async (req, res, next) => {
  try {
    const requestUrl = req.originalUrl.split('/')
    const { my_match_authToken } = req.cookies;
  
    if (!my_match_authToken &&
      (
        requestUrl.indexOf('signup-user-first-name') !== -1 ||
        requestUrl.indexOf('login') !== -1 ||
        requestUrl.indexOf('api') !== -1 ||
        requestUrl.indexOf('password') !== -1
      )
    ) return next();

    const jwtVerify = await jwt.verify(my_match_authToken, JWT_SECRET);
    const userDocument = await usersCollection().findOne({ _id: ObjectId(jwtVerify.my_match_userId) });

    const allConversationsCount = await messagesCollection().countDocuments({
      messages: {
        $elemMatch: {
          recipient: ObjectId(userDocument._id),
          read: false,
        }
      },
    });

    req.authUser = userDocument;
    req.allConversationsCount = allConversationsCount;
    next();
  } catch (error) {
    console.log(`error\n`, error);
    return res.render('landing-pages/_layouts/index', {
      locals: {
        title: 'Login - My Match',
        styles: [
          '/static/assets/styles/material-design-iconic-font.min.css',
          '/static/assets/styles/bootstrap.min.css',
          '/static/client/views/landing-pages/_layouts/global-styles.css',
          '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
          '/static/client/views/landing-pages/_partials/styles/footer.css',
          '/static/client/views/landing-pages/login/styles.css',
        ],
        scripts: [
          '/static/assets/apis/axios.min.js',
          '/static/assets/apis/js.cookie.min.js',
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
});

app.use('/register', register);
app.use('/login', login);
app.use('/password', password);
app.use('/users', users);
app.use('/user', user);
app.use('/search', search);
app.use('/messages', messages);
app.use('/settings', settings);

/* Redirect to the main view for any nonmatching routes where a valid my_match_authToken exists */
app.use('/*', (_req, res) => res.redirect('/users'));

const port = process.env.PORT || 3000;

/* Reload the app on every file change in development mode only */
if (process.env.NODE_ENV === 'localhost') {
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
};

app.listen(port, () => {
  if (process.send) {
    process.send('online');
    console.log(`Listening on port ${port}`);
  }
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const path = require('path');
const cookieParser = require('cookie-parser');
const osascript = require('node-osascript');

const { connectToServer, pingServer } = require('./db.js');
const { checkAuthentication, checkIPAddress } = require('./middleware/checkAuthentication');
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
  faqPage,
  indexPage,
  loginPage,
  privacyPolicyPage,
  resendEmailPage,
  signupPage,
  signupProfilePage,
  termsPage,
  verifyEmailPage,
} = require('./views/index');

const app = express();

const publicRoutes = [
  {
    '/api/auth-session/login': authSessionLogin,
  },
  {
    '/password': password,
  },
  {
    '/api/password': passwordApi,
  },
  {
    '/api/register': register,
  },
];

const privateRoutes = [
  {
    '/likes': likes,
  },
  {
    '/likes-me': likes,
  },
  {
    '/api/auth-session/logout': authSessionLogout,
  },
  {
    '/messages': messages,
  },
  {
    '/search': search,
  },
  {
    '/settings': settings,
  },
  {
    '/api/settings/account': settingsAccountApi,
  },
  {
    '/api/settings/password': settingsPasswordApi,
  },
  {
    '/user': user,
  },
  {
    '/profile': profile,
  },
  {
    '/api/user': userApi,
  },
  {
    '/users': users,
  },
];

app.use(express.json());
app.use(cookieParser());

/* Set static folder */
app.use('/static', express.static(path.join(process.env.PWD)));

app.engine('html', es6Renderer);
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'html');

app.use((_req, _res, next) => {
  connectToServer(async (err, _) => {
    if (err) throw err;
    const serverPing = await pingServer()
    const lastPing = await serverPing.find().toArray();
    const utc = new Date();

    if (!lastPing.length) {
      const pacificLocalTime = utc.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

      const newPing = {
        utc,
        pacificLocalTime,
      }

      await serverPing.insertOne({ ...newPing })

      setInterval(async () => {
        exec(`curl -I -s -o /dev/null -w "%{http_code}" "https://zawajina.onrender.com/"`);

        const now = new Date();

        console.log(`Last pinged at ${now.toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles'
        })}`);
      }, 600000)
    }

    next();
  });
});

app.use('/api/check-ip', (req, res, next) => {
  checkIPAddress(req, res, next).then(({ statusCode, response }) => {
    res.status(statusCode).send({ response });
  })
});

/* Public APIs */
publicRoutes.map(route => {
  const url = Object.keys(route)[0];
  const method = Object.values(route)[0];

  app.use(url, method);
})

/* Private APIs */
privateRoutes.map(route => {
  const url = Object.keys(route)[0];
  const method = Object.values(route)[0];

  app.use(url, checkAuthentication, method);
})

const publicViews = (res, my_match_authUserId) => {
  const authorizeUser = page => my_match_authUserId ? page(res) : res.redirect('/signup');

  return [
    {
      '/': () => indexPage(res),
    },
    {
      '/faq': () => faqPage(res),
    },
    {
      '/login': () => loginPage(res),
    },
    {
      '/signup': () => signupPage(res),
    },
    {
      '/verify-email': () => authorizeUser(verifyEmailPage),
    },
    {
      '/resend-email': () => authorizeUser(resendEmailPage),
    },
    {
      '/signup/profile': () => authorizeUser(signupProfilePage),
    },
    {
      '/terms': () => termsPage(res),
    },
    {
      '/privacy-policy': () => privacyPolicyPage(res),
    },
  ]
}

/* Catch all public GET requests, and respond with an html file */
app.get('*', (req, res, next) => {
  const requestUrl = req.originalUrl;

  // my_match_authUserId is to check for a user that lands on a public page without an ID
  // my_match_authToken is to redirect an authenticated user that visited an invalid route
  const { my_match_authUserId, my_match_authToken } = req.cookies;

  const publicView = publicViews(res, my_match_authUserId, my_match_authToken).find(route => Object.keys(route)[0] === requestUrl);

  if (publicView) {
    Object.values(publicView)[0]();
  } else {
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
    # tell application "Safari"
			##  activate
    #   set current_site to URL of document 1
    #   if current_site contains ("localhost") then
    #     tell window 1
    #       do JavaScript "window.location.reload(true)" in current tab
    #     end tell
    #   end if
    # end tell

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

const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { insertLogs, messagesCollection, usersCollection } = require('../db');
const { loginPage } = require('../views');
const { returnServerError } = require('../utils');

module.exports.checkAuthentication = async (req, res, next) => {
  try {
    const { my_match_authToken } = req.cookies;
    const originalUrl = req.originalUrl;
    const isApiCall = originalUrl.split('/').includes('api');

    if (!my_match_authToken) return res.redirect('/login');

    jwt.verify(my_match_authToken, JWT_SECRET, async (err, authUser) => {
      if (err || !authUser) {
        const userIPAddress = null;
        const endpoint = '/api/expired-session/logout'
        const jwtDecoded = jwt.decode(my_match_authToken);

        const userId = jwtDecoded?.my_match_userId;

        await insertLogs({}, userIPAddress, endpoint, userId);

        if (isApiCall) {
          if (process.env.NODE_ENV === 'development') {
            return res.status(401).send({ error: 'Expired authToken' });
          }

          return res.sendStatus(401);
        } else {
          loginPage(res);
        }
      } else {
        const userDocument = await usersCollection().findOne({ _id: ObjectId(authUser.my_match_userId) });
        if (!userDocument) return res.redirect('/login');

        const allConversationsCount = await messagesCollection().countDocuments({
          messages: {
            $elemMatch: {
              messageOtherUserId: ObjectId(userDocument._id),
              read: false,
            }
          },
        });

        req.authUser = userDocument;
        req.allConversationsCount = allConversationsCount;
        req.userIPAddress = req.headers.useripaddress;
        req.endpoint = originalUrl;

        const adminAccountStatus = userDocument._account.admin.accountStatus;
        const userAccountStatus = userDocument._account.user.accountStatus;

        if (adminAccountStatus === 'approved' && userAccountStatus === 'active') return next();
        if (adminAccountStatus === 'banned' && originalUrl !== '/profile') {
          /* For a banned account, the only option for the user is to log out. */
          if (originalUrl === '/api/auth-session/logout') return next();
          return res.status(403).send({ redirectUrl: '/profile' });
        }

        const permittedPaths = [
          '/profile',
          '/settings/account',
          '/settings/password',
        ]

        const permittedApis = [
          '/api/settings/account',
          '/api/settings/account/status',
          '/api/settings/password',
        ]

        const permittedCalls = pathname => {
          const isPermittedPath = permittedPaths.includes(pathname);
          const isPermittedApi = permittedApis.includes(pathname);
          const isProfileApi = pathname.startsWith('/api/user/profile-details/');
          return isPermittedPath || isPermittedApi || isProfileApi;
        }

        if (permittedCalls(originalUrl)) {
          next();
        } else {
          if (isApiCall) return res.send({ redirectUrl: '/profile' });
          return res.redirect('/profile');
        }
      }
    })
  } catch (error) {
    returnServerError(res, error);
  }
};

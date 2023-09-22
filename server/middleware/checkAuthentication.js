const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { messagesCollection, usersCollection, geoLocationData, insertLogs } = require('../db');
const { loginPage } = require('../views');
const { returnServerError } = require('../utils');

module.exports.checkIPAddress = async req => {
  let userIPAddress = req.headers?.useripaddress;
  let my_match_ipToken = req.cookies?.my_match_ipToken;
  const whitelistedCountries = ['AF', 'AL', 'AZ', 'BH', 'BD', 'BA', 'BN', 'EG', 'HK', 'IN', 'ID', 'IQ', 'JO', 'KZ', 'KE', 'KW', 'KG', 'LB', 'LR', 'LY', 'MY', 'ME', 'MA', 'OM', 'PK', 'PS', 'PH', 'QA', 'RU', 'SA', 'SG', 'LK', 'SE', 'SY', 'TW', 'TJ', 'TH', 'TT', 'TR', 'TM', 'AE', 'US', 'UZ', 'YE'];

  try {
    if (!my_match_ipToken) {
      if (!userIPAddress || userIPAddress === 'undefined') {
        return {
          userIPAddress,
          statusCode: 200,
          response: 'No user IP Address available',
        }
      }

      my_match_ipToken = jwt.sign({ userIPAddress }, JWT_SECRET, {
        expiresIn: '1 day',
        // expiresIn: '10000',
      });
    }

    userIPAddress = await jwt.verify(my_match_ipToken, JWT_SECRET).userIPAddress;
    const locationData = await geoLocationData(userIPAddress, req.authUser?.lastActive);
    if (!whitelistedCountries.includes(locationData.countryCode)) {
      return {
        userIPAddress,
        statusCode: 403,
        response: 'Your country is currently not allowed.',
      }
    }

    return {
      userIPAddress,
      statusCode: req.cookies.my_match_ipToken ? 200 : 201,
      response: my_match_ipToken,
    }
  } catch (error) {
    return {
      userIPAddress,
      statusCode: 200,
      response: { isJWTError: true },
    }
  }
}

module.exports.checkAuthentication = async (req, res, next) => {
  try {
    const { my_match_authToken } = req.cookies;
    const originalUrl = req.originalUrl;
    const isApiCall = originalUrl.split('/').includes('api');

    if (!my_match_authToken) return res.redirect('/login');

    jwt.verify(my_match_authToken, JWT_SECRET, async (err, authUser) => {
      if (err || !authUser) {
        req.originalUrl = '/api/expired-session/logout'
        const jwtDecoded = jwt.decode(my_match_authToken);
        const userId = jwtDecoded?.my_match_userId;
        const userDocument = await usersCollection().findOne({ _id: ObjectId(userId) });
        req.authUser = userDocument;

        insertLogs(req, {});

        if (isApiCall) return res.sendStatus(401);
        loginPage(res);
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

        exports.checkIPAddress(req, res, next);

        const adminAccountStatus = userDocument._account.admin.accountStatus;
        const userAccountStatus = userDocument._account.userAccountStatus;

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
          const isPermittedPath = permittedPaths?.includes(pathname);
          const isPermittedApi = permittedApis?.includes(pathname);
          const isProfileApi = pathname?.startsWith('/api/user/profile-details/');
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
